import React, { useState, useEffect } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 className="section-title">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#999" }}>
          Your cart is empty
        </p>
      ) : (
        <>
          <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
            {cart.map((item, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: "20px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <h3>{item.name}</h3>
                  <p style={{ color: "var(--primary-color)" }}>${item.price}</p>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "20px", textAlign: "right" }}>
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button className="btn btn-primary" style={{ marginTop: "15px" }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
