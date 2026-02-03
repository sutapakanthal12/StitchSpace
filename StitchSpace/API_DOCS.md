# StitchSpace API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "learner" // or "artisan"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "learner"
  }
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: Same as register
```

### Get Current User

```
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "_id": "123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "learner",
  "bio": "Textile enthusiast",
  "workshops": [...],
  "products": [...],
  "enrolledWorkshops": [...]
}
```

---

## 👥 User Endpoints

### Get User Profile

```
GET /users/:userId

Response:
{
  "_id": "123abc",
  "name": "Jane Artisan",
  "email": "jane@example.com",
  "role": "artisan",
  "bio": "Professional weaver",
  "profileImage": "url",
  "location": "India",
  "workshops": [...],
  "products": [...]
}
```

### Update User Profile

```
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Updated",
  "bio": "Updated bio",
  "profileImage": "url",
  "location": "New Location",
  "skills": ["Weaving", "Dyeing"]
}

Response: Updated user object
```

### Get All Artisans

```
GET /users/role/artisans

Response: Array of artisan objects
```

---

## 🏫 Workshop Endpoints

### Create Workshop (Artisan Only)

```
POST /workshops
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Weaving",
  "description": "Learn basic weaving techniques",
  "category": "Weaving",
  "price": 49.99,
  "duration": "4 weeks",
  "level": "Beginner",
  "maxParticipants": 30,
  "startDate": "2024-02-01",
  "materials": ["Loom", "Thread", "Scissors"],
  "learningOutcomes": ["Basic weaving", "Pattern design"],
  "images": ["url1", "url2"],
  "isSustainable": true
}

Response: Created workshop object
```

### Get All Workshops

```
GET /workshops?category=Weaving&level=Beginner&search=weaving

Query Parameters:
- category: Weaving | Embroidery | Dyeing | Knitting | Stitching | Other
- level: Beginner | Intermediate | Advanced
- search: Search in title/description

Response: Array of workshop objects
```

### Get Workshop Details

```
GET /workshops/:workshopId

Response:
{
  "_id": "123abc",
  "title": "Introduction to Weaving",
  "artisan": {
    "_id": "456def",
    "name": "Jane Artisan",
    "profileImage": "url",
    "bio": "Professional weaver"
  },
  "description": "...",
  "price": 49.99,
  "currentParticipants": 15,
  "maxParticipants": 30,
  "enrolled": ["user1", "user2"],
  "reviews": [
    {
      "userId": "user1",
      "rating": 5,
      "comment": "Great workshop!",
      "createdAt": "2024-01-15"
    }
  ],
  "averageRating": 4.8
}
```

### Enroll in Workshop

```
POST /workshops/:workshopId/enroll
Authorization: Bearer <token>

Response:
{
  "message": "Enrolled successfully"
}
```

### Add Workshop Review

```
POST /workshops/:workshopId/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent workshop!"
}

Response: Updated workshop with new review
```

---

## 🛍️ Product Endpoints

### Create Product (Artisan Only)

```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Handwoven Scarf",
  "description": "Beautiful handwoven scarf",
  "category": "Textiles",
  "price": 35.99,
  "quantity": 5,
  "materials": ["Cotton", "Natural dyes"],
  "dimensions": "50x150 cm",
  "customizable": true,
  "fairTradeCertified": true,
  "ecoFriendly": true,
  "artisanStory": "Made with love and care",
  "images": ["url1", "url2"]
}

Response: Created product object
```

### Get All Products

```
GET /products?category=Textiles&fairTrade=true&ecoFriendly=true&minPrice=10&maxPrice=100&search=scarf

Query Parameters:
- category: Textiles | Clothing | Accessories | Home Decor | Art Pieces
- fairTrade: true/false
- ecoFriendly: true/false
- minPrice: number
- maxPrice: number
- search: Search in name/description

Response: Array of product objects
```

### Get Product Details

```
GET /products/:productId

Response:
{
  "_id": "123abc",
  "name": "Handwoven Scarf",
  "artist": {
    "_id": "456def",
    "name": "Jane Artisan",
    "profileImage": "url"
  },
  "price": 35.99,
  "description": "...",
  "reviews": [...],
  "averageRating": 4.9,
  "sold": 12,
  "fairTradeCertified": true
}
```

### Add Product Review

```
POST /products/:productId/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Beautiful craftsmanship!"
}

Response: Updated product
```

### Update Product (Artisan Only)

```
PUT /products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 39.99,
  "quantity": 3
}

Response: Updated product
```

### Delete Product (Artisan Only)

```
DELETE /products/:productId
Authorization: Bearer <token>

Response:
{
  "message": "Product deleted"
}
```

---

## 📦 Order Endpoints

### Create Order

```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "productId1",
      "quantity": 2
    },
    {
      "product": "productId2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA"
  },
  "paymentMethodId": "pm_stripe_id"
}

Response:
{
  "_id": "orderId",
  "buyer": "userId",
  "items": [...],
  "totalAmount": 95.98,
  "status": "Pending",
  "createdAt": "2024-01-20"
}
```

### Get User Orders

```
GET /orders
Authorization: Bearer <token>

Response: Array of order objects
```

### Get Order Details

```
GET /orders/:orderId
Authorization: Bearer <token>

Response: Order object with populated items
```

---

## 💬 Community Endpoints

### Create Community Post

```
POST /community
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Latest Creation",
  "content": "Just finished this beautiful piece!",
  "type": "story", // story | challenge | question | artwork
  "images": ["url1", "url2"],
  "tags": ["weaving", "handmade"],
  "category": "Textiles"
}

Response: Created post object
```

### Get Community Posts

```
GET /community?type=story&category=Textiles&search=weaving

Query Parameters:
- type: story | challenge | question | artwork
- category: Textiles | Techniques | etc
- search: Search in title/content

Response: Array of posts sorted by date
```

### Get Post Details

```
GET /community/:postId

Response: Post with incremented viewCount
```

### Like Post

```
POST /community/:postId/like
Authorization: Bearer <token>

Response: Updated post
```

### Add Comment to Post

```
POST /community/:postId/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "This is amazing!"
}

Response: Updated post with new comment
```

---

## 📤 Upload Endpoints

### Upload Single File

```
POST /upload/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <file>

Response:
{
  "filename": "1234567890.jpg",
  "path": "/uploads/1234567890.jpg",
  "size": 245678
}
```

### Upload Multiple Files

```
POST /upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- files: <file1>, <file2>, ...

Response: Array of file objects
```

---

## ⚠️ Error Responses

### 401 Unauthorized

```json
{
  "message": "No token provided" or "Invalid token"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 500 Server Error

```json
{
  "message": "Server error message"
}
```

---

## 🧪 Testing with Postman

1. Import base URL: `http://localhost:5000/api`
2. Create collection: "StitchSpace"
3. Register a test user
4. Copy token from response
5. Add to Postman: Authorization > Bearer Token > Paste token
6. Test endpoints

---

## 📝 Rate Limiting

- No rate limiting in development
- Recommended for production: 100 requests/minute per IP

## 🔄 Pagination (Future Enhancement)

Add to query parameters:

- `page`: 1, 2, 3...
- `limit`: 10, 20, 50...

Example: `/products?page=1&limit=20`
