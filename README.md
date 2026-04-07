# 🛒 ShopEase — Full-Stack Microservices E-Commerce System

A complete microservices-based e-commerce application built for academic assignment demonstration.

**Stack:** Node.js · Express.js · MongoDB · Mongoose · React · Axios · Swagger · API Gateway

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── api-gateway/          # Single entry point (port 5000)
│   ├── product-service/      # Products CRUD (port 3001)
│   ├── user-service/         # Users CRUD (port 3002)
│   ├── cart-service/         # Cart management (port 3003)
│   ├── order-service/        # Order placement (port 3004)
│   └── payment-service/      # Simulated payments (port 3005)
└── frontend/                 # React app (port 3000)
```

Each microservice contains:
```
<service>/
├── server.js          # Entry point
├── package.json
├── .env.example
├── config/db.js       # MongoDB connection
├── models/            # Mongoose schema
├── controllers/       # Business logic
├── routes/            # Express routes + Swagger JSDoc
└── swagger/           # Swagger config
```

---

## ⚙️ Prerequisites

Install these before starting:

1. **Node.js** (v16+) — https://nodejs.org
2. **MongoDB** (Community Server) — https://www.mongodb.com/try/download/community
3. **npm** (comes with Node.js)

---

## 🚀 Step-by-Step Setup & Run Instructions

### Step 1 — Start MongoDB

**Windows:**
```bash
mongod --dbpath C:\data\db
```
Or start MongoDB from Services (if installed as a service).

**macOS/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod --dbpath ~/data/db
```

Verify MongoDB is running:
```bash
mongosh
# Should show a connection prompt
```

---

### Step 2 — Install Dependencies for All Services

Run these commands from the project root. Each service is independent:

```bash
# Product Service
cd backend/product-service && npm install && cd ../..

# User Service
cd backend/user-service && npm install && cd ../..

# Cart Service
cd backend/cart-service && npm install && cd ../..

# Order Service
cd backend/order-service && npm install && cd ../..

# Payment Service
cd backend/payment-service && npm install && cd ../..

# API Gateway
cd backend/api-gateway && npm install && cd ../..

# Frontend
cd frontend && npm install && cd ..
```

---

### Step 3 — Create .env Files

Copy the example .env file in each service:

```bash
# For each service, run:
cp backend/product-service/.env.example  backend/product-service/.env
cp backend/user-service/.env.example     backend/user-service/.env
cp backend/cart-service/.env.example     backend/cart-service/.env
cp backend/order-service/.env.example    backend/order-service/.env
cp backend/payment-service/.env.example  backend/payment-service/.env
cp backend/api-gateway/.env.example      backend/api-gateway/.env
```

---

### Step 4 — Start All Backend Services

Open **6 separate terminal windows/tabs** and run one command in each:

**Terminal 1 — Product Service:**
```bash
cd backend/product-service
npm start
# → Running on http://localhost:3001
```

**Terminal 2 — User Service:**
```bash
cd backend/user-service
npm start
# → Running on http://localhost:3002
```

**Terminal 3 — Cart Service:**
```bash
cd backend/cart-service
npm start
# → Running on http://localhost:3003
```

**Terminal 4 — Order Service:**
```bash
cd backend/order-service
npm start
# → Running on http://localhost:3004
```

**Terminal 5 — Payment Service:**
```bash
cd backend/payment-service
npm start
# → Running on http://localhost:3005
```

**Terminal 6 — API Gateway:**
```bash
cd backend/api-gateway
npm start
# → Running on http://localhost:5000
```

---

### Step 5 — Start the React Frontend

**Terminal 7:**
```bash
cd frontend
npm start
# → Opens http://localhost:3000
```

---

### Step 6 — Seed Sample Products (Optional but Recommended)

From project root (with all services running):
```bash
node seed.js
```
This adds 8 sample products via the API Gateway.

---

## 🌐 Port Reference

| Service          | Port | Purpose                        |
|-----------------|------|--------------------------------|
| React Frontend  | 3000 | User-facing web application    |
| Product Service | 3001 | Product CRUD microservice      |
| User Service    | 3002 | User CRUD microservice         |
| Cart Service    | 3003 | Cart management microservice   |
| Order Service   | 3004 | Order placement microservice   |
| Payment Service | 3005 | Payment processing microservice|
| API Gateway     | 5000 | Single entry point for all APIs|

---

## 📄 Swagger Documentation URLs

### Direct Access (individual service ports):

| Service  | Swagger URL                          |
|---------|--------------------------------------|
| Products | http://localhost:3001/api-docs       |
| Users    | http://localhost:3002/api-docs       |
| Cart     | http://localhost:3003/api-docs       |
| Orders   | http://localhost:3004/api-docs       |
| Payments | http://localhost:3005/api-docs       |

### Via API Gateway (single port):

| Service  | Gateway Swagger URL                      |
|---------|------------------------------------------|
| Products | http://localhost:5000/product-docs       |
| Users    | http://localhost:5000/user-docs          |
| Cart     | http://localhost:5000/cart-docs          |
| Orders   | http://localhost:5000/order-docs         |
| Payments | http://localhost:5000/payment-docs       |

---

## 🔗 API Endpoint Reference

### Direct Endpoints (service ports):

```
GET    http://localhost:3001/products
GET    http://localhost:3001/products/:id
POST   http://localhost:3001/products
PUT    http://localhost:3001/products/:id
DELETE http://localhost:3001/products/:id

GET    http://localhost:3002/users
GET    http://localhost:3002/users/:id
POST   http://localhost:3002/users
PUT    http://localhost:3002/users/:id
DELETE http://localhost:3002/users/:id

GET    http://localhost:3003/cart?userId=demo-user-001
POST   http://localhost:3003/cart/add
DELETE http://localhost:3003/cart/remove/:productId?userId=demo-user-001
DELETE http://localhost:3003/cart/clear?userId=demo-user-001

GET    http://localhost:3004/orders
GET    http://localhost:3004/orders/:id
POST   http://localhost:3004/orders
PUT    http://localhost:3004/orders/:id/status

GET    http://localhost:3005/payments
GET    http://localhost:3005/payments/:id
POST   http://localhost:3005/payments
PUT    http://localhost:3005/payments/:id/status
```

### Via API Gateway (port 5000 only):

```
GET    http://localhost:5000/api/products
POST   http://localhost:5000/api/products
GET    http://localhost:5000/api/users
POST   http://localhost:5000/api/users
GET    http://localhost:5000/api/cart?userId=demo-user-001
POST   http://localhost:5000/api/cart/add
GET    http://localhost:5000/api/orders
POST   http://localhost:5000/api/orders
GET    http://localhost:5000/api/payments
POST   http://localhost:5000/api/payments
```

---

## 🧪 Testing the System

### Using Swagger UI (Recommended for Demo):

1. Open http://localhost:5000/product-docs
2. Click "POST /products" → "Try it out"
3. Paste this body:
```json
{
  "name": "Test Product",
  "price": 49.99,
  "description": "A test product",
  "category": "Electronics",
  "stock": 10,
  "imageUrl": "https://picsum.photos/seed/test/300/180"
}
```
4. Click Execute → should return 201 with the created product

### Using curl:

```bash
# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"category":"Electronics","stock":5}'

# Get all products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo-user-001","productId":"<id>","name":"Laptop","price":999.99,"quantity":1}'

# Place an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo-user-001","items":[{"productId":"<id>","name":"Laptop","price":999.99,"quantity":1}],"total":999.99}'

# Process payment
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<orderId>","amount":999.99,"paymentMethod":"credit_card"}'
```

---

## 🗄️ MongoDB Databases Created

Each service uses its own isolated database (key microservices principle):

| Database Name              | Used By         |
|---------------------------|-----------------|
| ecommerce_product_db       | Product Service |
| ecommerce_user_db          | User Service    |
| ecommerce_cart_db          | Cart Service    |
| ecommerce_order_db         | Order Service   |
| ecommerce_payment_db       | Payment Service |

Verify in MongoDB shell:
```bash
mongosh
show dbs
```

---


### System flow:
> "User visits frontend → clicks Add to Cart → React calls gateway at port 5000 → gateway forwards to Cart Service at port 3003 → Cart Service saves to MongoDB → response comes back up to the user."

---

## 👥 Member Contributions

| Member   | Microservice     | Responsibilities                                              |
|---------|-----------------|---------------------------------------------------------------|
| Member 1 | Product Service  | Product model, CRUD endpoints, Swagger docs, port 3001        |
| Member 2 | User Service     | User model, CRUD endpoints, Swagger docs, port 3002           |
| Member 3 | Cart Service     | Cart model, add/remove/clear logic, Swagger docs, port 3003   |
| Member 4 | Order Service    | Order model, order placement, status updates, port 3004       |
| Member 5 | Payment Service  | Payment model, simulated processing, status updates, port 3005|

**Shared (all members):** API Gateway integration, React frontend, MongoDB setup, testing

---

## 📸 Screenshots to Take for Presentation

1. React frontend — Product listing page with product cards
2. React frontend — Cart page with items and total
3. React frontend — Payment page with method selection
4. React frontend — Orders page with status badges
5. Swagger UI — Product Service at http://localhost:5000/product-docs
6. Swagger UI — Execute a POST /products request and show 201 response
7. Terminal windows — All 6 services running simultaneously
8. Browser — http://localhost:5000 showing gateway info JSON
9. MongoDB shell — `show dbs` showing all 5 separate databases
10. Browser — Same endpoint accessed directly (port 3001) vs via gateway (port 5000)
