const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("workshops")
      .populate("products");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put("/:userId", auth, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.params.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      name,
      bio,
      profileImage,
      skills,
      location,
      websiteUrl,
      socialLinks,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        name,
        bio,
        profileImage,
        skills,
        location,
        websiteUrl,
        socialLinks,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all artisans
router.get("/role/artisans", async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan" })
      .select("-password")
      .populate("workshops")
      .populate("products");
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
