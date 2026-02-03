const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../middleware/auth");

// ============ CREATE ORDER (WITH ROLE VALIDATION) ============
router.post("/", auth, async (req, res) => {
  try {
    // Verify buyer role
    const user = await User.findById(req.userId);
    if (!user || user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can place orders. Learners and artisans cannot purchase.",
      });
    }

    const {
      products,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    // Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.phoneNumber ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    // Validate payment method
    const validPaymentMethods = ["COD", "UPI", "DEBIT_CARD", "CREDIT_CARD", "NET_BANKING"];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method selected",
      });
    }

    // Validate products
    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products in order",
      });
    }

    // Calculate total amount and verify products
    let totalAmount = 0;
    const processedProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      processedProducts.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        images: product.images || [],
      });
    }

    // Set payment status based on payment method
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Pending";
    const orderStatus = "Placed";

    // Create order
    const order = new Order({
      buyerId: req.userId,
      products: processedProducts,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
    });

    await order.save();

    // Update product sold count
    for (let item of processedProducts) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { sold: item.quantity },
      });
    }

    // Add order to user's purchases
    await User.findByIdAndUpdate(req.userId, {
      $push: { purchases: order._id },
    });

    res.status(201).json({
      message: `Order placed successfully with ${paymentMethod}!`,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============ GET USER'S ORDERS ============
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Buyers can view their orders
    if (user.role === "buyer") {
      const orders = await Order.find({ buyerId: req.userId })
        .sort({ createdAt: -1 });
      return res.json(orders);
    }

    // Artisans can view orders of their products
    if (user.role === "artisan") {
      const orders = await Order.find({
        "products.productId": { $in: user.products },
      }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    // Learners cannot view orders
    res.status(403).json({
      message: "Only buyers and artisans can view orders",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ GET ORDER BY ID ============
router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify access: buyer can only see their own orders
    if (order.buyerId.toString() !== req.userId) {
      return res.status(403).json({
        message: "You do not have access to this order",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ UPDATE ORDER STATUS (FOR ADMINS/ARTISANS) ============
router.patch("/:orderId/status", auth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const user = await User.findById(req.userId);

    // Only admins or artisans can update order status
    if (user.role !== "admin" && user.role !== "artisan") {
      return res.status(403).json({
        message: "Only admins and artisans can update orders",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        orderStatus,
        paymentStatus,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ CANCEL ORDER ============
router.delete("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only buyer or admin can cancel
    if (
      order.buyerId.toString() !== req.userId &&
      (await User.findById(req.userId)).role !== "admin"
    ) {
      return res.status(403).json({
        message: "You cannot cancel this order",
      });
    }

    // Can only cancel if order is not shipped
    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Cannot cancel shipped or delivered orders",
      });
    }

    await Order.findByIdAndUpdate(req.params.orderId, {
      orderStatus: "Cancelled",
    });

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
