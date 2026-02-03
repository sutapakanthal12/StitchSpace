# 🧪 Razorpay Integration - Quick Testing Guide

## ⚡ Start Testing in 5 Minutes

### Step 1: Start Servers
```bash
cd c:\Users\sutap\OneDrive\Desktop\pro\StitchSpace
npm run dev
```

Both backend (5000) and frontend (3000) will start automatically.

### Step 2: Open Browser
```
http://localhost:3000
```

### Step 3: Login as Buyer
- Click "Auth" button
- Login with buyer credentials
- Should redirect to /marketplace?view=buy

---

## 🧪 Test Scenario 1: Cash on Delivery (COD)

### Steps
```
1. Click "Buy Now" on any product
2. Verify /checkout/:productId loads
3. Fill address form:
   - Full Name: John Doe
   - Phone: 9876543210
   - Address: 123 Main Street
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 12345
4. Select payment method: "💵 Cash on Delivery"
5. Click "🛒 Place Order"
```

### Expected Result
```
✅ Button shows "⏳ Processing..."
✅ Success alert: "✅ Order created successfully"
✅ Redirect to /buyer/orders
✅ Order visible with status "Placed" (yellow badge)
✅ Payment status "Pending" (orange badge)
✅ No Razorpay popup (direct order creation)
```

### What Happens Behind the Scenes
```
User clicks "Place Order"
    ↓
Frontend validates address
    ↓
Frontend calls POST /api/orders
    - paymentMethod: "COD"
    - paymentStatus: "Pending"
    ↓
Backend creates order in database
    ↓
Frontend redirects to /buyer/orders
```

---

## 💳 Test Scenario 2: UPI Payment

### Steps
```
1. Go back to /marketplace?view=buy (click Continue Shopping)
2. Click "Buy Now" on a different product
3. Fill address form (same as above)
4. Select payment method: "📱 UPI Payment"
5. Click "💳 Pay with UPI"
```

### Expected Result
```
✅ Button shows "⏳ Processing..."
✅ Razorpay popup opens with:
   - UPI option selected
   - Product image and amount
   - Pre-filled customer details
   - "Proceed" button
```

### Complete the Test Payment
```
In Razorpay Popup:
1. Select UPI
2. Enter test VPA: success@razorpay
3. Click "Proceed"
4. Confirm payment
5. See "Redirecting back..." message
```

### Expected Result After Payment
```
✅ Success alert: "✅ Order created successfully"
✅ Redirect to /buyer/orders
✅ New order visible with status "Confirmed" (blue badge)
✅ Payment status "Paid" (green badge)
✅ razorpayPaymentId stored in database
```

### What Happens Behind the Scenes
```
User clicks "Pay with UPI"
    ↓
Frontend calls POST /api/payment/create-order
    - totalAmount: product price
    ↓
Backend creates Razorpay order
    ↓
Frontend receives razorpayOrderId
    ↓
Razorpay popup opens
    ↓
User completes payment in popup
    ↓
Razorpay returns payment details
    ↓
Frontend calls POST /api/payment/verify
    - razorpayOrderId
    - razorpayPaymentId
    - razorpaySignature
    ↓
Backend verifies signature
    ↓
Backend creates order with:
    - paymentMethod: "ONLINE"
    - paymentStatus: "Paid"
    - orderStatus: "Confirmed"
    ↓
Frontend redirects to /buyer/orders
```

---

## 💰 Test Scenario 3: Debit Card Payment

### Steps
```
1. Go back to /marketplace?view=buy
2. Click "Buy Now" on another product
3. Fill address form
4. Select payment method: "🏦 Debit Card"
5. Click "💳 Pay with Debit Card"
6. Razorpay popup opens
```

### Test Card Details
```
Card Number: 4111111111111111
Expiry: 12/25 (any future date)
CVV: 123 (any 3 digits)
OTP: 111111 (when prompted)
```

### Steps in Popup
```
1. Select "Cards" in Razorpay popup
2. Enter test card details above
3. Click "Pay"
4. Enter OTP when prompted: 111111
5. Complete payment
```

### Expected Result
```
✅ Payment succeeds
✅ Order created with "Paid" status
✅ Redirect to /buyer/orders
✅ Order shows "Confirmed" status
```

---

## 🏦 Test Scenario 4: Net Banking Payment

### Steps
```
1. Go to /marketplace?view=buy
2. Click "Buy Now"
3. Fill address
4. Select "🌐 Net Banking"
5. Click "💳 Pay with Net Banking"
```

### In Razorpay Popup
```
1. Select "Net Banking"
2. Choose any test bank (e.g., "HDFC Bank")
3. Click "Proceed"
4. Login with any credentials
5. Select account
6. Authorize payment
7. Enter OTP: 111111
```

### Expected Result
```
✅ Payment succeeds
✅ Order created with "Paid" status
✅ Redirect to /buyer/orders
```

---

## ❌ Test Scenario 5: Failed Payment

### Steps
```
1. Click "Buy Now"
2. Fill address
3. Select "UPI Payment"
4. Click "Pay with UPI"
5. Enter invalid test details (e.g., invalid card)
6. Try to complete
```

### Expected Result
```
✅ Payment fails in popup
✅ Popup shows error message
✅ No order created
✅ User can retry
```

---

## 📊 Test Scenario 6: Verify Orders

### Steps
```
1. After testing both COD and online payments
2. Go to /buyer/orders
3. Scroll through order list
```

### Expected Displays
```
For COD Orders:
- Status: "Placed" (yellow badge)
- Payment: "Pending" (orange badge)
- No razorpayPaymentId

For Online Payment Orders:
- Status: "Confirmed" (blue badge)
- Payment: "Paid" (green badge)
- razorpayPaymentId visible in database

All Orders Should Show:
- Order ID (ORD-timestamp)
- Date and time placed
- Product image, name, quantity, price
- Full delivery address (name, address, city, state, pincode, phone)
- Total amount
```

---

## ✅ Verification Checklist

### COD Test
- [ ] Address form fills without errors
- [ ] COD option selectable
- [ ] Place Order button works
- [ ] No popup appears
- [ ] Order created in database
- [ ] Status is "Placed" + "Pending"
- [ ] Redirect to /buyer/orders works
- [ ] Order visible in list

### Online Payment Test
- [ ] Address form fills without errors
- [ ] Online payment option selectable
- [ ] Pay button shows correct label
- [ ] Razorpay popup opens
- [ ] Pre-filled details correct
- [ ] Can select different payment method
- [ ] Test payment completes
- [ ] Order created in database
- [ ] Status is "Confirmed" + "Paid"
- [ ] Redirect to /buyer/orders works
- [ ] Order visible with payment ID

### Error Handling
- [ ] Invalid phone shows error
- [ ] Invalid pincode shows error
- [ ] Empty fields show errors
- [ ] Non-buyer user cannot access
- [ ] Failed payment handled gracefully

---

## 🐛 Troubleshooting

### Issue: Razorpay popup not opening
**Symptoms**: Click pay button, nothing happens

**Solutions**:
1. Check browser console (F12) for errors
2. Verify Razorpay script loaded (Network tab)
3. Check /api/payment/create-order response (Network tab)
4. Verify backend is running on port 5000
5. Restart frontend server

### Issue: Payment verification fails
**Symptoms**: Popup closes but no success message

**Solutions**:
1. Check backend logs for signature error
2. Verify RAZORPAY_KEY_SECRET in .env
3. Check /api/payment/verify response (Network tab)
4. Look for error message in console

### Issue: Order not created after payment
**Symptoms**: Payment succeeds but no order

**Solutions**:
1. Check backend logs
2. Verify MongoDB connection
3. Check /api/payment/verify response
4. Look at browser console errors
5. Verify user is buyer role

### Issue: "Only buyers can make payments"
**Symptoms**: Error message on payment attempt

**Solutions**:
1. Logout
2. Login with buyer account (not learner/artisan)
3. Verify user role in database
4. Try again

### Issue: Test payment doesn't work
**Symptoms**: Payment fails with error

**Solutions**:
1. Use correct test card: 4111111111111111
2. Use valid future expiry date
3. Any 3-digit CVV works
4. OTP is always 111111
5. Try different payment method

---

## 📈 What to Check in Database

### MongoDB Check
```javascript
// Check Order document
{
  orderId: "ORD-...",
  paymentMethod: "COD" or "ONLINE",
  paymentStatus: "Pending" or "Paid",
  orderStatus: "Placed" or "Confirmed",
  razorpayOrderId: "order_xxx" or null,
  razorpayPaymentId: "pay_xxx" or null,
  deliveryAddress: { ... },
  totalAmount: 500,
  createdAt: ...
}
```

---

## 🎯 Success Criteria

After testing, you should be able to:

✅ Place COD orders without payment gateway
✅ Open Razorpay popup for online payments
✅ Complete test payments in popup
✅ See orders in order history
✅ View complete order details
✅ See razorpay IDs in database (for online payments)
✅ Handle errors gracefully
✅ Retry after failed payment

---

## 📞 Quick Tips

1. **Always test COD first** - It's simpler and shows if form works
2. **Use test details** - Card 4111111111111111 always works
3. **Check network tab** - See actual API responses
4. **Check console** - Look for JavaScript errors
5. **Check backend logs** - See server-side issues
6. **Restart servers** - If anything seems broken, restart

---

## ⏱️ Estimated Testing Time

- COD test: 2 minutes
- UPI test: 3 minutes
- Card test: 3 minutes
- Net Banking test: 3 minutes
- Error handling test: 2 minutes

**Total**: ~13 minutes to fully test Razorpay integration

---

**Ready to test?** Start with COD, then try online payments! 🚀
