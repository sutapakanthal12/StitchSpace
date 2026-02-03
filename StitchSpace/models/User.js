const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["learner", "artisan", "admin", "buyer"],
    default: "buyer",
  },
  bio: String,
  profileImage: String,
  skills: [String],
  location: String,
  websiteUrl: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
  },
  workshops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  enrolledWorkshops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
    },
  ],
  purchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
