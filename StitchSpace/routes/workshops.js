const express = require("express");
const router = express.Router();
const Workshop = require("../models/Workshop");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create workshop
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      duration,
      level,
      maxParticipants,
      startDate,
      materials,
      images,
      learningOutcomes,
    } = req.body;

    const workshop = new Workshop({
      title,
      description,
      artisan: req.userId,
      category,
      price,
      duration,
      level,
      maxParticipants,
      startDate,
      materials,
      images,
      learningOutcomes,
    });

    await workshop.save();

    // Add workshop to user's workshops
    await User.findByIdAndUpdate(req.userId, {
      $push: { workshops: workshop._id },
    });

    res.status(201).json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all workshops
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const workshops = await Workshop.find(query)
      .populate("artisan", "name profileImage bio")
      .sort({ createdAt: -1 });

    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single workshop
router.get("/:workshopId", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId)
      .populate("artisan")
      .populate("enrolled", "name profileImage");

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in workshop
router.post("/:workshopId/enroll", auth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.workshopId);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (workshop.enrolled.includes(req.userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    if (workshop.currentParticipants >= workshop.maxParticipants) {
      return res.status(400).json({ message: "Workshop is full" });
    }

    workshop.enrolled.push(req.userId);
    workshop.currentParticipants += 1;
    await workshop.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { enrolledWorkshops: workshop._id },
    });

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post("/:workshopId/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const workshop = await Workshop.findById(req.params.workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    workshop.reviews.push({
      userId: req.userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    const totalRating = workshop.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    workshop.averageRating = totalRating / workshop.reviews.length;

    await workshop.save();
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
