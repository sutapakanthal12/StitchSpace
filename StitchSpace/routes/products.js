const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create product
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      quantity,
      materials,
      dimensions,
      customizable,
      fairTradeCertified,
      ecoFriendly,
      artisanStory,
      images,
    } = req.body;

    const product = new Product({
      name,
      description,
      artist: req.userId,
      category,
      price,
      quantity,
      materials,
      dimensions,
      customizable,
      fairTradeCertified,
      ecoFriendly,
      artisanStory,
      images,
    });

    await product.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { products: product._id },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, fairTrade, ecoFriendly, minPrice, maxPrice } =
      req.query;
    let query = {};

    if (category) query.category = category;
    if (fairTrade === "true") query.fairTradeCertified = true;
    if (ecoFriendly === "true") query.ecoFriendly = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query)
      .populate("artist", "name profileImage bio")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "artist"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post("/:productId/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push({
      userId: req.userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put("/:productId", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.artist.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete("/:productId", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.artist.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Product.findByIdAndDelete(req.params.productId);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
