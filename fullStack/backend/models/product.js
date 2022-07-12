const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  img: { type: String },
  category: { type: String, ref: "Category", required: true },
  price: { type: Number, required: true },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("Product", productSchema);
exports.Product = Product;