const express = require("express");
const Razorpay = require("razorpay");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

// ============ HELPER: GET RAZORPAY INSTANCE ============
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  console.log("=== RAZORPAY CREDENTIALS CHECK ===");
  console.log("RAZORPAY_KEY_ID from env:", keyId ? `${keyId.substring(0, 10)}...` : "UNDEFINED");
  console.log("RAZORPAY_KEY_SECRET from env:", keySecret ? `${keySecret.substring(0, 5)}***` : "UNDEFINED");
  console.log("KEY_ID exists:", !!keyId);
  console.log("KEY_SECRET exists:", !!keySecret);
  console.log("=====================================");
  
  if (!keyId || !keySecret) {
    const missingFields = [];
    if (!keyId) missingFields.push("RAZORPAY_KEY_ID");
    if (!keySecret) missingFields.push("RAZORPAY_KEY_SECRET");
    throw new Error(`Razorpay credentials not configured. Missing: ${missingFields.join(", ")}`);
  }
  
  try {
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log("✅ Razorpay instance created successfully");
    return instance;
  } catch (err) {
    console.error("❌ Failed to create Razorpay instance:", err);
    throw err;
  }
};

// ============ CREATE RAZORPAY ORDER ============
/**
 * POST /api/payment/create-order
 * Creates a Razorpay order for online payments
 * Only accessible by buyers
 *
 * Input:
 *   - totalAmount (in rupees, will be converted to paise)
 *
 * Output:
 *   - razorpay order object with id, amount, currency
 *
 * Error:
 *   - 401: Not authenticated
 *   - 403: User is not a buyer
 *   - 400: Missing or invalid totalAmount
 *   - 500: Razorpay error
 */
router.post("/create-order", auth, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const user = req.user;

    console.log("\n=== CREATE ORDER REQUEST ===");
    console.log("User ID:", user._id);
    console.log("User Role:", user.role);
    console.log("Amount (rupees):", totalAmount);

    // ============ VALIDATION ============
    // Only buyers can make payments
    if (user.role !== "buyer") {
      console.error("❌ User is not a buyer:", user.role);
      return res.status(403).json({
        success: false,
        message: "Only buyers can initiate online payments",
      });
    }

    // Validate amount
    if (!totalAmount || totalAmount <= 0) {
      console.error("❌ Invalid amount:", totalAmount);
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ============ CREATE RAZORPAY ORDER ============
    console.log("Getting Razorpay instance...");
    const razorpay = getRazorpayInstance();
    
    // Razorpay expects amount in paise (smallest unit of currency)
    const amountInPaise = Math.round(totalAmount * 100);
    console.log("Amount in paise:", amountInPaise);

    const orderOptions = {
      amount: amountInPaise, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      },
    };

    console.log("Creating Razorpay order with options:", JSON.stringify(orderOptions, null, 2));
    
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    console.log("✅ Razorpay order created successfully");
    console.log("Order ID:", razorpayOrder.id);

    // ============ RESPONSE ============
    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("\n❌ ERROR CREATING RAZORPAY ORDER ❌");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
      details: error.statusCode ? `Razorpay Error ${error.statusCode}` : "Internal Server Error",
    });
  }
});

// ============ VERIFY PAYMENT ============
/**
 * POST /api/payment/verify
 * Verifies Razorpay payment signature
 * Called after successful payment in frontend
 *
 * Input:
 *   - razorpayOrderId
 *   - razorpayPaymentId
 *   - razorpaySignature
 *
 * Output:
 *   - Success status and verification result
 */
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      totalAmount,
      products,
      deliveryAddress,
    } = req.body;

    const user = req.user;

    // ============ VALIDATION ============
    if (user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can verify payments",
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // ============ VERIFY SIGNATURE ============
    // Create signature using HMAC SHA256
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // ============ CREATE ORDER IN DATABASE ============
    const order = new Order({
      buyerId: user._id,
      products,
      totalAmount,
      deliveryAddress,
      paymentMethod: "ONLINE",
      paymentStatus: "Paid",
      orderStatus: "Confirmed", // Auto-confirm online payments
      razorpayOrderId,
      razorpayPaymentId,
    });

    const savedOrder = await order.save();

    // ============ UPDATE USER'S PURCHASES ============
    const User = require("../models/User");
    await User.findByIdAndUpdate(user._id, {
      $push: { purchases: savedOrder._id },
    });

    // ============ RESPONSE ============
    return res.status(201).json({
      success: true,
      message: "Payment verified and order created successfully",
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

module.exports = router;
