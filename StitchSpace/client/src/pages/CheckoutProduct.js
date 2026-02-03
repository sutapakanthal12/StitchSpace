import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CheckoutProduct({ user }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  // ============ STATE MANAGEMENT ============
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Error state
  const [error, setError] = useState("");

  // ============ LOAD RAZORPAY SCRIPT ============
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ============ ROLE VALIDATION & LOAD PRODUCT ============
  useEffect(() => {
    // Only buyers can access checkout
    if (!user) {
      navigate("/auth");
      return;
    }

    if (user.role !== "buyer") {
      alert("❌ Only buyers can checkout. Please login as a buyer.");
      navigate("/marketplace?view=buy");
      return;
    }

    // Fetch product details
    if (productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Product not found");
      setLoading(false);
    }
  };

  // ============ HANDLE ADDRESS CHANGE ============
  const handleAddressChange = (field, value) => {
    setAddress({
      ...address,
      [field]: value,
    });
    setError(""); // Clear error when user starts typing
  };

  // ============ VALIDATE ADDRESS ============
  const validateAddress = () => {
    if (!address.name.trim()) {
      setError("Please enter your full name");
      return false;
    }

    if (!address.phoneNumber.trim() || address.phoneNumber.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    if (!address.address.trim()) {
      setError("Please enter your address");
      return false;
    }

    if (!address.city.trim()) {
      setError("Please enter your city");
      return false;
    }

    if (!address.state.trim()) {
      setError("Please enter your state");
      return false;
    }

    if (!address.pincode.trim() || address.pincode.length < 5) {
      setError("Please enter a valid pincode (at least 5 digits)");
      return false;
    }

    return true;
  };

  // ============ PLACE ORDER (COD ONLY) ============
  const placeOrderDirect = async () => {
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        products: [
          {
            productId: product._id,
            quantity: 1,
          },
        ],
        deliveryAddress: {
          fullName: address.name,
          phoneNumber: address.phoneNumber,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: "India",
        },
        paymentMethod: "COD",
      };

      const response = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`✅ ${response.data.message}`);
      navigate("/buyer/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // ============ HANDLE ONLINE PAYMENT ============
  const handleOnlinePayment = async (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      return;
    }

    setRazorpayLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Step 1: Create Razorpay order
      const paymentOrderResponse = await axios.post(
        "/api/payment/create-order",
        {
          totalAmount: product.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { razorpayOrderId, keyId } = paymentOrderResponse.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyId,
        amount: product.price * 100, // Amount in paise
        currency: "INR",
        order_id: razorpayOrderId,
        name: "StitchSpace",
        description: `Purchase - ${product.name}`,
        image: product.images?.[0] || "https://via.placeholder.com/100",
        handler: function (response) {
          // Step 3: On success, verify payment
          handlePaymentSuccess(response, razorpayOrderId);
        },
        prefill: {
          name: address.name,
          email: user.email || "",
          contact: address.phoneNumber,
        },
        notes: {
          productId: product._id,
          productName: product.name,
        },
        theme: {
          color: "var(--primary-color)",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating online payment:", error);
      setError(error.response?.data?.message || "Failed to process payment");
    } finally {
      setRazorpayLoading(false);
    }
  };

  // ============ HANDLE PAYMENT SUCCESS ============
  const handlePaymentSuccess = async (paymentResponse, razorpayOrderId) => {
    try {
      const token = localStorage.getItem("token");

      // Verify payment on backend
      const verifyResponse = await axios.post(
        "/api/payment/verify",
        {
          razorpayOrderId,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          totalAmount: product.price,
          products: [
            {
              productId: product._id,
              quantity: 1,
            },
          ],
          deliveryAddress: {
            fullName: address.name,
            phoneNumber: address.phoneNumber,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: "India",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ ${verifyResponse.data.message}`);
      navigate("/buyer/orders");
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError(error.response?.data?.message || "Payment verification failed");
    }
  };

  // ============ HANDLE PLACE ORDER ============
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      return;
    }

    if (paymentMethod === "COD") {
      setSubmitting(true);
      await placeOrderDirect();
    } else {
      // Online payment methods
      await handleOnlinePayment(e);
    }
  };

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2em" }}>
        ⏳ Loading product details...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>❌ {error}</h2>
        <button
          onClick={() => navigate("/marketplace?view=buy")}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  if (!product) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Product not found</div>;
  }

  // ============ RENDER ============
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>🛒 Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "30px" }}>
        {/* LEFT COLUMN: ADDRESS & PAYMENT */}
        <div>
          {/* ============ DELIVERY ADDRESS ============ */}
          <div className="card" style={{ padding: "25px", marginBottom: "25px" }}>
            <h2>📍 Delivery Address</h2>

            <form style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={address.name}
                onChange={(e) => handleAddressChange("name", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: error && !address.name ? "2px solid red" : "1px solid #ddd",
                  fontSize: "1em",
                }}
              />

              <input
                type="tel"
                placeholder="Phone Number (10+ digits) *"
                value={address.phoneNumber}
                onChange={(e) => handleAddressChange("phoneNumber", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: error && address.phoneNumber.length < 10 ? "2px solid red" : "1px solid #ddd",
                  fontSize: "1em",
                }}
              />

              <textarea
                placeholder="Address (Street, Building, etc.) *"
                value={address.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: error && !address.address ? "2px solid red" : "1px solid #ddd",
                  fontSize: "1em",
                  minHeight: "80px",
                  fontFamily: "Arial",
                  resize: "vertical",
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <input
                  type="text"
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: error && !address.city ? "2px solid red" : "1px solid #ddd",
                    fontSize: "1em",
                  }}
                />

                <input
                  type="text"
                  placeholder="State *"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: error && !address.state ? "2px solid red" : "1px solid #ddd",
                    fontSize: "1em",
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Pincode (5+ digits) *"
                value={address.pincode}
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: error && address.pincode.length < 5 ? "2px solid red" : "1px solid #ddd",
                  fontSize: "1em",
                }}
              />
            </form>
          </div>

          {/* ============ PAYMENT METHOD ============ */}
          <div className="card" style={{ padding: "25px" }}>
            <h2>💳 Payment Method</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              {/* CASH ON DELIVERY */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "15px",
                  border: "2px solid " + (paymentMethod === "COD" ? "var(--primary-color)" : "#ddd"),
                  borderRadius: "8px",
                  backgroundColor: paymentMethod === "COD" ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div>
                  <strong>💵 Cash on Delivery (COD)</strong>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9em" }}>
                    Pay when order arrives. No payment needed now.
                  </p>
                </div>
              </label>

              {/* ONLINE PAYMENT OPTIONS */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "15px",
                  border: "2px solid " + (paymentMethod === "UPI" ? "var(--primary-color)" : "#ddd"),
                  borderRadius: "8px",
                  backgroundColor: paymentMethod === "UPI" ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div>
                  <strong>📱 UPI Payment</strong>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9em" }}>
                    Google Pay, PhonePe, BHIM, or other UPI apps
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "15px",
                  border: "2px solid " + (paymentMethod === "DEBIT_CARD" ? "var(--primary-color)" : "#ddd"),
                  borderRadius: "8px",
                  backgroundColor: paymentMethod === "DEBIT_CARD" ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="DEBIT_CARD"
                  checked={paymentMethod === "DEBIT_CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div>
                  <strong>🏦 Debit Card</strong>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9em" }}>
                    Secure debit card payment
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "15px",
                  border: "2px solid " + (paymentMethod === "CREDIT_CARD" ? "var(--primary-color)" : "#ddd"),
                  borderRadius: "8px",
                  backgroundColor: paymentMethod === "CREDIT_CARD" ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="CREDIT_CARD"
                  checked={paymentMethod === "CREDIT_CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div>
                  <strong>💳 Credit Card</strong>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9em" }}>
                    Secure credit card payment
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "15px",
                  border: "2px solid " + (paymentMethod === "NET_BANKING" ? "var(--primary-color)" : "#ddd"),
                  borderRadius: "8px",
                  backgroundColor: paymentMethod === "NET_BANKING" ? "#f0f8ff" : "white",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="NET_BANKING"
                  checked={paymentMethod === "NET_BANKING"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div>
                  <strong>🌐 Net Banking</strong>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9em" }}>
                    Direct bank transfer
                  </p>
                </div>
              </label>
            </div>

            {/* PAYMENT METHOD INFO */}
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fffbea", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
              {paymentMethod === "COD" && (
                <p style={{ margin: 0, color: "#333" }}>
                  ℹ️ <strong>COD Notice:</strong> Payment will be collected at the time of delivery.
                </p>
              )}
              {paymentMethod !== "COD" && (
                <p style={{ margin: 0, color: "#333" }}>
                  ℹ️ <strong>Online Payment:</strong> You'll be redirected to the secure payment gateway.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT SUMMARY */}
        <div>
          <div className="card" style={{ padding: "25px", position: "sticky", top: "20px" }}>
            <h2>📦 Order Summary</h2>

            {/* PRODUCT DETAILS */}
            <div
              style={{
                marginTop: "15px",
                paddingBottom: "20px",
                borderBottom: "1px solid #eee",
              }}
            >
              {/* Product Image */}
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginBottom: "15px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "8px",
                    backgroundColor: "#e8e8e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3em",
                    marginBottom: "15px",
                  }}
                >
                  🎨
                </div>
              )}

              <h3 style={{ margin: "0 0 8px 0" }}>{product.name}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "0.9em" }}>
                Category: {product.category}
              </p>

              {product.description && (
                <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.9em" }}>
                  {product.description}
                </p>
              )}

              {/* Badges */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                {product.ecoFriendly && (
                  <span style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8em", fontWeight: "bold" }}>
                    🌱 Eco-Friendly
                  </span>
                )}
                {product.fairTradeCertified && (
                  <span style={{ backgroundColor: "#fff3e0", color: "#e65100", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8em", fontWeight: "bold" }}>
                    🏅 Fair Trade
                  </span>
                )}
              </div>

              <p style={{ fontSize: "1.3em", fontWeight: "bold", color: "var(--primary-color)" }}>
                Price: ₹{product.price}
              </p>
            </div>

            {/* PRICING BREAKDOWN */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Subtotal:</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Shipping:</span>
                <span style={{ color: "green" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Tax:</span>
                <span>₹0</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "2px solid #ddd",
                  fontSize: "1.3em",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span style={{ color: "var(--primary-color)" }}>₹{product.price.toLocaleString()}</span>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                }}
              >
                ❌ {error}
              </div>
            )}

            {/* PLACE ORDER BUTTON */}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting || razorpayLoading}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "25px",
                backgroundColor: submitting || razorpayLoading ? "#ccc" : "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1em",
                fontWeight: "bold",
                cursor: submitting || razorpayLoading ? "not-allowed" : "pointer",
              }}
            >
              {submitting || razorpayLoading
                ? "⏳ Processing..."
                : paymentMethod === "COD"
                ? `🛒 Place Order (₹${product.price.toLocaleString()})`
                : `💳 Pay with ${
                    paymentMethod === "UPI"
                      ? "UPI"
                      : paymentMethod === "DEBIT_CARD"
                      ? "Debit Card"
                      : paymentMethod === "CREDIT_CARD"
                      ? "Credit Card"
                      : "Net Banking"
                  } (₹${product.price.toLocaleString()})`}
            </button>

            <button
              onClick={() => navigate("/marketplace?view=buy")}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                backgroundColor: "transparent",
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                borderRadius: "8px",
                fontSize: "1em",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutProduct;
