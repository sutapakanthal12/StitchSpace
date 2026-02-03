# 🔑 Razorpay API Keys Setup Guide

## ❌ Current Error
```
Authentication failed (401)
```

This error happens when:
- ❌ The API keys are invalid
- ❌ The key pair doesn't match
- ❌ The keys are for wrong environment (live instead of test)

---

## ✅ How to Get Valid Razorpay Test Keys

### Step 1: Create Razorpay Account
Go to: https://razorpay.com/signup

### Step 2: Login & Get Test Keys
1. Login to: https://dashboard.razorpay.com
2. Click **Settings** (⚙️ icon)
3. Click **API Keys**
4. Make sure you're on **Test** tab (not Live)
5. Copy your **Key ID** and **Key Secret**

### Step 3: Update `.env` File
Open `.env` file and replace with your keys:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012
```

### Step 4: Restart Server
```bash
# Kill existing server
taskkill /F /IM node.exe

# Restart
npm run dev
```

---

## 🧪 Test with Sample Data

### Test Card Numbers
```
4111 1111 1111 1111  → Success
3333 3333 3333 3333  → Failure (for testing error handling)
```

### Test UPI
```
success@razorpay  → Success
```

### Test Net Banking
```
Any test bank option available in dropdown
```

---

## 🔍 Debug Checklist

- [ ] Keys are from **Test** tab (not Live)
- [ ] Key ID starts with `rzp_test_`
- [ ] Both Key ID and Secret are copied exactly
- [ ] `.env` file is saved
- [ ] Server is restarted after `.env` change
- [ ] No extra spaces in keys
- [ ] Keys are not in quotes in `.env`

---

## 📝 Key Format

| Component | Format | Example |
|-----------|--------|---------|
| Key ID | `rzp_test_XXXXX` | `rzp_test_1Aa00000000001` |
| Key Secret | Alphanumeric (20-30 chars) | `abcd1234efgh5678ijkl9012` |

---

## ⚡ Quick Fix

If you have your keys ready:

1. Open `.env` file
2. Find lines 14-15:
```env
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012
```

3. Replace with YOUR actual keys from Razorpay dashboard
4. Save file
5. Restart server: `npm run dev`

---

## ✅ How to Verify Keys are Working

After updating keys, when you try to create an order:

**Before (Error):**
```
❌ Error: Authentication failed
statusCode: 401
```

**After (Success):**
```
✅ Razorpay order created successfully
Order ID: order_abc123xyz
Amount: 50000 (in paise)
```

---

## 🚀 Once Keys are Working

1. Go to http://localhost:3000
2. Login as buyer
3. Click "Buy Now" on any product
4. Select online payment (UPI/Card/etc)
5. Use test card: `4111 1111 1111 1111`
6. Complete payment

---

## 🆘 Still Getting Error?

Check these things:

1. **Keys copied exactly?**
   - No extra spaces
   - No quotes around keys
   - Complete key (don't cut off)

2. **On Test tab in dashboard?**
   - Live keys start with `rzp_live_`
   - Test keys start with `rzp_test_`
   - You need TEST keys

3. **Restarted server?**
   - Press Ctrl+C to stop `npm run dev`
   - Kill Node: `taskkill /F /IM node.exe`
   - Restart: `npm run dev`

4. **Check `.env` syntax**
   - No quotes: `RAZORPAY_KEY_ID=rzp_test_abc` ✅
   - Not: `RAZORPAY_KEY_ID="rzp_test_abc"` ❌

5. **Look at server console**
   - Should show: `KEY_ID exists: true`
   - Should show: `KEY_SECRET exists: true`
   - If false, keys are not loading

---

## 📞 Razorpay Support

- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/
- Test Card Docs: https://razorpay.com/docs/testing/

---

## 💡 Pro Tips

- Save your keys somewhere safe
- Never commit `.env` to git
- Test with test keys first before using live keys
- Check console logs for detailed error messages
- Restart server after any `.env` changes

---

**Status**: ⏳ Waiting for valid Razorpay test keys  
**Next Step**: Get your keys from https://dashboard.razorpay.com and update `.env`
