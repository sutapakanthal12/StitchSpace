const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// ============================================
// ENVIRONMENT VALIDATION
// ============================================
const requiredEnvVars = ["JWT_SECRET"];
const optionalEnvVars = {
  MONGO_URI: "mongodb://localhost:27017/stitchspace",
  NODE_ENV: "development",
  FRONTEND_URL: "http://localhost:3000",
  PORT: "5000",
};

// Validate required environment variables
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("❌ CRITICAL: Missing required environment variables:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nPlease set these variables before starting the server.");
  process.exit(1);
}

console.log("✅ All required environment variables validated");

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
// Build allowed origins dynamically
const baseOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
  "https://stitch-space-isew.vercel.app",
];

// Add FRONTEND_URL if provided
const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl && !baseOrigins.includes(frontendUrl)) {
  baseOrigins.push(frontendUrl);
}

console.log("📡 CORS allowed origins:");
baseOrigins.forEach((origin) => {
  console.log(`   - ${origin}`);
});

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (baseOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked request from: ${origin}`);
      callback(new Error("CORS: Origin not allowed"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check endpoint (before MongoDB dependency)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ============================================
// MONGODB CONNECTION
// ============================================
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/stitchspace";

console.log("🔄 Connecting to MongoDB...");
console.log(`   URI: ${mongoURI.split("@")[1] || "local instance"}`);

let connectionAttempts = 0;
const maxRetries = 3;
const retryDelay = 3000; // 3 seconds

function connectMongoDB() {
  connectionAttempts++;

  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      minPoolSize: 2,
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      connectionAttempts = 0; // Reset counter on success
    })
    .catch((err) => {
      console.error(
        `❌ MongoDB connection error (Attempt ${connectionAttempts}/${maxRetries}):`,
        err.message,
      );

      if (connectionAttempts < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(connectMongoDB, retryDelay);
      } else {
        console.error("❌ Max MongoDB connection retries exceeded");
        console.error(
          "⚠️  Server will continue running but without database connection",
        );
        console.error(
          "   Some endpoints may not work until MongoDB is available",
        );
      }
    });
}

connectMongoDB();

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("📊 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("📊 Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("📊 Mongoose disconnected from MongoDB");
});

// ============================================
// API ROUTES
// ============================================
const routesConfig = [
  { path: "/api/auth", file: "../routes/auth" },
  { path: "/api/users", file: "../routes/users" },
  { path: "/api/workshops", file: "../routes/workshops" },
  { path: "/api/products", file: "../routes/products" },
  { path: "/api/orders", file: "../routes/orders" },
  { path: "/api/payment", file: "../routes/payment" },
  { path: "/api/community", file: "../routes/community" },
  { path: "/api/upload", file: "../routes/upload" },
];

// Load routes with error handling
routesConfig.forEach(({ path, file }) => {
  try {
    app.use(path, require(file));
    console.log(`✅ Route loaded: ${path}`);
  } catch (err) {
    console.error(`❌ Failed to load route ${path}:`, err.message);
  }
});

// 404 Handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    method: req.method,
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔴 Unhandled error:", err);

  // CORS errors
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS error",
      message: err.message,
    });
  }

  // Mongoose errors
  if (err.name === "MongooseError") {
    return res.status(503).json({
      error: "Database error",
      message: "Unable to connect to database",
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
});

// ============================================
// SERVER STARTUP
// ============================================
const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log("");
  console.log("╔════════════════════════════════════════╗");
  console.log("║     🚀 StitchSpace Backend Server      ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`📍 Server: http://${HOST}:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📦 MongoDB: ${mongoose.connection.readyState === 1 ? "✅ Connected" : "⏳ Connecting..."}`,
  );
  console.log("");
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("\n🛑 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

// ============================================
// UNHANDLED PROMISE REJECTIONS
// ============================================
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  // In production, you might want to restart the process
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

module.exports = app;
