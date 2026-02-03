const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["Weaving", "Embroidery", "Dyeing", "Knitting", "Stitching", "Other"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: String, // e.g., "4 weeks"
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  maxParticipants: {
    type: Number,
    default: 30,
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  startDate: Date,
  endDate: Date,
  schedule: String,
  materials: [String],
  images: [String],
  videoUrl: String,
  learningOutcomes: [String],
  enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
  isSustainable: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workshop", workshopSchema);
