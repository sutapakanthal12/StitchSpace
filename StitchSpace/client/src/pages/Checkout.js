import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout({ user }) {
  const navigate = useNavigate();

  // ============ STATE MANAGEMENT ============
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Address form state
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ============ ROLE VALIDATION ============
  useEffect(() => {
    // Only buyers can access checkout
    if (!user) {
      navigate("/auth");
      return;
    }

    if (user.role !== "buyer") {
      alert("❌ Only buyers can place orders. Learners and artisans cannot checkout.");
      navigate("/marketplace");
      return;
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setCart(cartItems);
      calculateTotal(cartItems);
    } else {
      alert("Your cart is empty!");
      navigate("/marketplace?view=buy");
    }
  }, [user, navigate]);

  // ============ CALCULATE TOTAL ============
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * (item.quantity || 1);
    }, 0);
    setTotalAmount(total);
  };

  // ============ HANDLE ADDRESS CHANGE ============
  const handleAddressChange = (field, value) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [field]: value,
    });
  };

  // ============ VALIDATE ADDRESS ============
  const validateAddress = () => {
    const { fullName, phoneNumber, address, city, state, pincode } = deliveryAddress;

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return false;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    if (!address.trim()) {
      alert("Please enter your address");
      return false;
    }

    if (!city.trim()) {
      alert("Please enter your city");
      return false;
    }

    if (!state.trim()) {
      alert("Please enter your state");
      return false;
    }

    if (!pincode.trim() || pincode.length < 5) {
      alert("Please enter a valid pincode (at least 5 digits)");
      return false;
    }

    return true;
  };

  // ============ PLACE ORDER ============
  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare order data
      const orderData = {
        products: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity || 1,
        })),
        deliveryAddress,
        paymentMethod,
      };

      // Create order
      const response = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear cart after successful order
      localStorage.removeItem("cart");

      // Show success message
      alert(`✅ ${response.data.message}`);

      // Redirect based on payment method
      if (paymentMethod === "COD") {
        // For COD, redirect to order confirmation
        navigate(`/order-confirmation/${response.data.order._id}`);
      } else {
        // For online payment, redirect to payment gateway
        // This can be extended for Razorpay/Stripe integration
        navigate(`/payment/${response.data.order._id}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ============ RENDER ============
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>🛍️ Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "30px" }}>
        {/* LEFT COLUMN: ADDRESS & PAYMENT */}
        <div>
          {/* ============ DELIVERY ADDRESS ============ */}
          <div className="card" style={{ padding: "25px", marginBottom: "25px" }}>
            <h2>📍 Delivery Address</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={deliveryAddress.fullName}
                onChange={(e) => handleAddressChange("fullName", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1em",
                }}
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                value={deliveryAddress.phoneNumber}
                onChange={(e) => handleAddressChange("phoneNumber", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1em",
                }}
              />

              <textarea
                placeholder="Address (Street, Building, etc.) *"
                value={deliveryAddress.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
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
                  value={deliveryAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1em",
                  }}
                />

                <input
                  type="text"
                  placeholder="State *"
                  value={deliveryAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1em",
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Pincode *"
                value={deliveryAddress.pincode}
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1em",
                }}
              />

              <input
                type="text"
                placeholder="Country"
                value={deliveryAddress.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                disabled
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1em",
                  backgroundColor: "#f5f5f5",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>

          {/* ============ PAYMENT METHOD ============ */}
          <div className="card" style={{ padding: "25px" }}>
            <h2>💳 Payment Method</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              {/* CASH ON DELIVERY */}
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "15px", border: "2px solid " + (paymentMethod === "COD" ? "var(--primary-color)" : "#ddd"), borderRadius: "8px", backgroundColor: paymentMethod === "COD" ? "#f0f8ff" : "white" }}>
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
                    Pay when your order arrives. No payment needed now.
                  </p>
                </div>
              </label>

              {/* ONLINE PAYMENT OPTIONS */}
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "15px", border: "2px solid " + (paymentMethod === "UPI" ? "var(--primary-color)" : "#ddd"), borderRadius: "8px", backgroundColor: paymentMethod === "UPI" ? "#f0f8ff" : "white" }}>
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
                    Pay via Google Pay, PhonePe, BHIM, or other UPI apps
                  </p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "15px", border: "2px solid " + (paymentMethod === "DEBIT_CARD" ? "var(--primary-color)" : "#ddd"), borderRadius: "8px", backgroundColor: paymentMethod === "DEBIT_CARD" ? "#f0f8ff" : "white" }}>
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
                    Use your bank debit card for secure payment
                  </p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "15px", border: "2px solid " + (paymentMethod === "CREDIT_CARD" ? "var(--primary-color)" : "#ddd"), borderRadius: "8px", backgroundColor: paymentMethod === "CREDIT_CARD" ? "#f0f8ff" : "white" }}>
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
                    Use your bank credit card for secure payment
                  </p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "15px", border: "2px solid " + (paymentMethod === "NET_BANKING" ? "var(--primary-color)" : "#ddd"), borderRadius: "8px", backgroundColor: paymentMethod === "NET_BANKING" ? "#f0f8ff" : "white" }}>
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
                    Pay directly from your bank account
                  </p>
                </div>
              </label>
            </div>

            {/* PAYMENT METHOD INFO */}
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fffbea", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
              {paymentMethod === "COD" && (
                <p style={{ margin: 0, color: "#333" }}>
                  ℹ️ <strong>COD Notice:</strong> Your order will be placed. Payment will be collected at the time of delivery.
                </p>
              )}
              {paymentMethod !== "COD" && (
                <p style={{ margin: 0, color: "#333" }}>
                  ℹ️ <strong>Online Payment:</strong> You'll be redirected to the secure payment gateway after placing the order.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div>
          <div className="card" style={{ padding: "25px", position: "sticky", top: "20px" }}>
            <h2>📦 Order Summary</h2>

            {/* CART ITEMS */}
            {cart.length > 0 ? (
              <div style={{ marginTop: "15px", maxHeight: "400px", overflowY: "auto" }}>
                {cart.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "15px",
                      paddingBottom: "15px",
                      marginBottom: "15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {/* Product Image */}
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "8px",
                          backgroundColor: "#e8e8e8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2em",
                        }}
                      >
                        🎨
                      </div>
                    )}

                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                      <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "0.9em" }}>
                        Qty: {item.quantity || 1}
                      </p>
                      <p style={{ margin: 0, fontWeight: "bold", color: "var(--primary-color)" }}>
                        ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
                Your cart is empty
              </p>
            )}

            {/* PRICING BREAKDOWN */}
            {cart.length > 0 && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
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
                  <span style={{ color: "var(--primary-color)" }}>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* PLACE ORDER BUTTON */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cart.length === 0}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "25px",
                backgroundColor: loading || cart.length === 0 ? "#ccc" : "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1em",
                fontWeight: "bold",
                cursor: loading || cart.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "⏳ Processing..." : `🛒 Place Order (₹${totalAmount.toLocaleString()})`}
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

export default Checkout;
