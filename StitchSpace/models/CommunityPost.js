const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["challenge", "story", "question", "artwork"],
    default: "story",
  },
  images: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      comment: String,
      createdAt: Date,
      likes: Number,
    },
  ],
  tags: [String],
  category: String,
  viewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CommunityPost", communityPostSchema);
