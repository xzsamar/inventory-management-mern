const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  oldQty: { type: Number, required: true },
  newQty: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String, default: "Admin" }
}, { timestamps: true });

module.exports = mongoose.model("InventoryHistory", historySchema);
