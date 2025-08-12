const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, trim: true },
  unit: { type: String, trim: true },
  category: { type: String, trim: true },
  brand: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
  image: { type: String, trim: true }
}, { timestamps: true });

productSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
