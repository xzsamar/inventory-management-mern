const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

// Multer for CSV upload
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// GET /api/products?name=&category=&page=&limit=&sort=
router.get('/', async (req, res) => {
  try {
    const { name, category, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      data: items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products/import
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'CSV file required' });

  const filePath = req.file.path;
  const rows = [];
  fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: true, ignoreEmpty: true, trim: true }))
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'CSV parse error' });
      fs.unlink(filePath, () => {});
    })
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      let added = 0;
      const duplicates = [];
      for (const r of rows) {
        // Normalize fields
        const doc = {
          name: r.name?.trim(),
          unit: r.unit || '',
          category: r.category || '',
          brand: r.brand || '',
          stock: Number(r.stock || 0),
          status: r.status && ['In Stock','Out of Stock'].includes(r.status) ? r.status : (Number(r.stock||0) > 0 ? 'In Stock' : 'Out of Stock'),
          image: r.image || ''
        };
        if (!doc.name) continue;
        const exists = await Product.findOne({ name: doc.name });
        if (exists) {
          duplicates.push(exists);
        } else {
          await Product.create(doc);
          added++;
        }
      }
      fs.unlink(filePath, () => {});
      res.json({ added, skipped: duplicates.length, duplicates });
    });
});

// GET /api/products/export
router.get('/export', async (req, res) => {
  try {
    const products = await Product.find();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);
    products.forEach(p => {
      const o = p.toObject();
      csvStream.write({
        name: o.name,
        unit: o.unit,
        category: o.category,
        brand: o.brand,
        stock: o.stock,
        status: o.status,
        image: o.image
      });
    });
    csvStream.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Export failed' });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const body = req.body;

    // Validate editable fields
    const updates = {};
    const editable = ['name','unit','category','brand','stock','status','image'];
    for (const key of editable) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (updates.name) {
      const clash = await Product.findOne({ name: updates.name, _id: { $ne: req.params.id } });
      if (clash) return res.status(400).json({ message: 'Name must be unique' });
    }

    if (updates.stock !== undefined) {
      const n = Number(updates.stock);
      if (Number.isNaN(n) || n < 0) return res.status(400).json({ message: 'Stock must be a non-negative number' });
      updates.stock = n;
      updates.status = n > 0 ? 'In Stock' : 'Out of Stock';
    }

    const prev = await Product.findById(req.params.id);
    if (!prev) return res.status(404).json({ message: 'Product not found' });

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (updates.stock !== undefined && updates.stock !== prev.stock) {
      await InventoryHistory.create({
        productId: prev._id,
        oldQty: prev.stock,
        newQty: updates.stock,
        user: 'Admin'
      });
    }

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
});

// GET /api/products/:id/history
router.get('/:id/history', async (req, res) => {
  try {
    const history = await InventoryHistory.find({ productId: req.params.id }).sort({ date: -1, createdAt: -1 });
    res.json(history);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

module.exports = router;
