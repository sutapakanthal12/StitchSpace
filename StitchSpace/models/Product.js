const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["Textiles", "Clothing", "Accessories", "Home Decor", "Art Pieces"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  images: [String],
  materials: [String],
  dimensions: String,
  customizable: Boolean,
  fairTradeCertified: Boolean,
  ecoFriendly: Boolean,
  artisanStory: String,
  reviews: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date,
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
