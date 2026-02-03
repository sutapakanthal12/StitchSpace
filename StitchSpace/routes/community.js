const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Create post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, type, images, tags, category } = req.body;

    const post = new CommunityPost({
      author: req.userId,
      title,
      content,
      type,
      images,
      tags,
      category,
    });

    await post.save();
    await post.populate("author", "name profileImage");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await CommunityPost.find(query)
      .populate("author", "name profileImage")
      .populate("comments.userId", "name profileImage")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get("/:postId", async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.postId,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate("author")
      .populate("comments.userId");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like post
router.post("/:postId/like", auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const liked = post.likes.includes(req.userId);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post("/:postId/comment", auth, async (req, res) => {
  try {
    const { comment } = req.body;

    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.userId,
      comment,
      createdAt: new Date(),
      likes: 0,
    });

    await post.save();
    await post.populate("comments.userId", "name profileImage");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
