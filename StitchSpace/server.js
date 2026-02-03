const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// CORS Configuration - Allow both local development and production URLs
const allowedOrigins = [
  "http://localhost:3000",           // Local React development
  "http://localhost:5000",           // Local fallback
  "https://stitch-space-isew.vercel.app", // Vercel deployment
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB Connection
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/stitchspace";
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(() => {
      mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    }, 5000);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/workshops", require("./routes/workshops"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/community", require("./routes/community"));
app.use("/api/upload", require("./routes/upload"));

// Serve static files from React build
app.use(express.static(path.join(__dirname, "client/build")));

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Catch all handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
