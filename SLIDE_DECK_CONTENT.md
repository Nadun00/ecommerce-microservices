# 📊 SLIDE DECK CONTENT
# Microservices-Based E-Commerce System
# (Copy each section into your presentation tool)

---

## SLIDE 1 — Title Slide

**Title:** Microservices-Based E-Commerce System

**Subtitle:** A Full-Stack Application using Node.js, Express, MongoDB & React

**Group Members:**
- Member 1 — Product Service
- Member 2 — User Service
- Member 3 — Cart Service
- Member 4 — Order Service
- Member 5 — Payment Service

**Course / Subject / Date**

---

## SLIDE 2 — Introduction to the Domain

**Business Domain: E-Commerce**

E-commerce is one of the most complex and widely used real-world domains, involving:

- Product catalog management
- User account handling
- Shopping cart interactions
- Order processing workflows
- Payment handling

Real-world systems like **Amazon, Flipkart, and Shopify** use microservices to manage these responsibilities independently and at scale.

We modeled our system after this architecture to demonstrate real-world applicability.

---

## SLIDE 3 — Problem Statement

**The Problem with Traditional (Monolithic) Architecture:**

In a monolith:
- All features are bundled in a single codebase
- One failure can crash the entire system
- Difficult for multiple developers to work simultaneously
- Hard to scale specific parts independently
- Deployment of one feature requires redeploying everything

**Our Solution:**
Break the system into 5 independent microservices — one per team member — each responsible for a single domain function.

---

## SLIDE 4 — Why Microservices?

**Key Reasons:**

| Benefit | Explanation |
|---------|-------------|
| Independent Development | Each member works on their own service without conflicts |
| Isolated Failures | If one service crashes, the rest continue running |
| Independent Scaling | High-traffic services (like products) can be scaled alone |
| Technology Flexibility | Each service can use its own tech stack if needed |
| Easier Maintenance | Smaller, focused codebases are easier to understand |
| Real-World Relevance | Netflix, Amazon, Uber all use microservices architecture |

---

## SLIDE 5 — Our 5 Microservices

| # | Service | Port | Responsibility |
|---|---------|------|----------------|
| 1 | Product Service | 3001 | Manage product catalog (CRUD) |
| 2 | User Service | 3002 | Manage user accounts (CRUD) |
| 3 | Cart Service | 3003 | Add/remove/clear cart items |
| 4 | Order Service | 3004 | Place and track orders |
| 5 | Payment Service | 3005 | Simulate payment processing |
| + | API Gateway | 5000 | Single entry point for all services |

---

## SLIDE 6 — Service Responsibilities

**1. Product Service**
- Stores product catalog in MongoDB
- Supports Create, Read, Update, Delete operations
- Fields: name, price, description, category, stock, imageUrl

**2. User Service**
- Stores user profiles in MongoDB
- Manages customer accounts
- Fields: name, email, phone, address

**3. Cart Service**
- Stores cart per user (userId-based)
- Add items, remove items, clear cart, calculate total
- Items include: productId, name, price, quantity

**4. Order Service**
- Creates orders from cart items
- Tracks order status: pending → confirmed → shipped → delivered
- Stores full order history

**5. Payment Service**
- Simulates payment processing
- Supports: credit card, debit card, PayPal, cash on delivery
- 90% success rate simulation with real status tracking

---

## SLIDE 7 — API Gateway Explanation

**What is an API Gateway?**

An API Gateway is a server that acts as the **single entry point** for all client requests. It receives requests from the frontend and routes them to the appropriate microservice.

**Our Gateway:**
- Runs on **port 5000**
- Built with **Express.js + http-proxy-middleware**
- Routes requests to correct microservices
- Also proxies Swagger documentation

```
Frontend (3000)
     ↓
API Gateway (5000)
     ↓         ↓         ↓         ↓         ↓
Products   Users     Cart    Orders  Payments
 (3001)   (3002)   (3003)   (3004)   (3005)
```

---

## SLIDE 8 — How API Gateway Avoids Multiple Ports

**Without API Gateway:**
```
Frontend must know:
  http://localhost:3001  (products)
  http://localhost:3002  (users)
  http://localhost:3003  (cart)
  http://localhost:3004  (orders)
  http://localhost:3005  (payments)
= 5 different URLs to manage!
```

**With API Gateway:**
```
Frontend only knows ONE URL:
  http://localhost:5000

Gateway routes internally:
  /api/products  → :3001
  /api/users     → :3002
  /api/cart      → :3003
  /api/orders    → :3004
  /api/payments  → :3005
```

**Benefits:**
- Frontend is decoupled from internal service locations
- Services can move to different ports/servers without frontend changes
- Single place for cross-cutting concerns (logging, CORS)

---

## SLIDE 9 — MongoDB Usage

**Why MongoDB?**

- Document-based (stores JSON-like objects — matches our JS data)
- Schema flexibility — each service defines its own model
- Easy to set up locally with no configuration
- Works natively with Node.js via Mongoose

**Database Isolation (Microservices Best Practice):**

Each service has its **own dedicated database**:

| Service | Database |
|---------|----------|
| Product Service | ecommerce_product_db |
| User Service | ecommerce_user_db |
| Cart Service | ecommerce_cart_db |
| Order Service | ecommerce_order_db |
| Payment Service | ecommerce_payment_db |

This ensures services are truly independent — no shared database coupling.

---

## SLIDE 10 — Frontend + Backend Integration Flow

**Technology:** React + Axios + React Router

**Flow:**
```
1. User opens http://localhost:3000 (React app)
2. React fetches products → GET http://localhost:5000/api/products
3. Gateway forwards → Product Service at :3001
4. MongoDB returns data → back to frontend
5. User clicks "Add to Cart" → POST /api/cart/add → Gateway → Cart Service
6. User clicks "Place Order" → POST /api/orders → Gateway → Order Service
7. User submits payment → POST /api/payments → Gateway → Payment Service
```

**Key Rule:** The React frontend NEVER calls service ports directly.
All calls go through the gateway at port 5000.

---

## SLIDE 11 — System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           React Frontend  (port 3000)            │
│  Products | Cart | Orders | Payment | Users      │
└─────────────────┬───────────────────────────────┘
                  │  All API calls via Axios
                  ▼
┌─────────────────────────────────────────────────┐
│           API Gateway  (port 5000)               │
│   Routing  |  Logging  |  CORS  |  Proxy         │
└──┬──────┬──────┬──────┬──────┬───────────────────┘
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼
[3001] [3002] [3003] [3004] [3005]
Product  User  Cart  Order  Payment
Service Service Service Service Service
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼
[product][user][cart][order][payment]
   _db    _db   _db    _db    _db
       (MongoDB Databases)
```

---

## SLIDE 12 — Swagger Documentation

**What is Swagger?**

Swagger (OpenAPI) is a tool that automatically generates interactive API documentation. Developers can test endpoints directly from the browser without any other tool.

**In our system:**
- Every microservice has Swagger at `/api-docs`
- All Swagger UIs are also accessible via the API Gateway

**Two ways to access (demonstrates gateway routing):**

| Method | Example URL |
|--------|-------------|
| Direct | http://localhost:3001/api-docs |
| Via Gateway | http://localhost:5000/product-docs |

*Show screenshots of Swagger UI during demo*

---

## SLIDE 13 — Direct Access vs Gateway Access

**Demonstration of Two Access Methods:**

**Direct Access (bypasses gateway):**
```
GET http://localhost:3001/products
→ Calls Product Service directly on port 3001
```

**Via API Gateway:**
```
GET http://localhost:5000/api/products
→ Gateway receives request
→ Internally forwards to http://localhost:3001/products
→ Same result, but through gateway
```

**Both return identical responses** — this proves:
1. Services work independently
2. Gateway successfully proxies all traffic
3. Frontend can use either method (but should always use gateway)

---

## SLIDE 14 — Screenshots to Capture

For your presentation, take these screenshots:

1. **Home page** — React app showing product cards grid
2. **Cart page** — Items in cart with total price
3. **Payment page** — Payment method selection
4. **Orders page** — Order list with status badges
5. **Swagger UI** — Product service docs at /product-docs
6. **Swagger Execute** — POST /products with 201 response
7. **Terminals** — 6 terminal windows showing all services running
8. **Gateway info** — Browser showing http://localhost:5000 JSON response
9. **MongoDB** — Terminal showing `show dbs` with all 5 databases
10. **Side by side** — Same endpoint via direct port AND via gateway

---

## SLIDE 15 — Group Contributions

| Member | Service | Key Contributions |
|--------|---------|-------------------|
| Member 1 | Product Service | Product Mongoose model · CRUD controller · Express routes · Swagger JSDoc annotations |
| Member 2 | User Service | User Mongoose model · CRUD controller · Express routes · Swagger JSDoc annotations |
| Member 3 | Cart Service | Cart model with embedded items · Add/remove/clear logic · Total calculation · Swagger docs |
| Member 4 | Order Service | Order model with status enum · Order creation · Status update endpoint · Swagger docs |
| Member 5 | Payment Service | Payment model · Simulated processing logic · Status tracking · Swagger docs |

**Shared Contributions (All Members):**
- API Gateway configuration and routing
- React frontend integration
- MongoDB database setup
- System testing and integration

---

## SLIDE 16 — Conclusion

**What We Built:**
- A fully functional e-commerce web application
- Using microservices architecture with 5 independent services
- Each service with its own MongoDB database
- A single API Gateway routing all traffic
- Swagger documentation for every endpoint
- React frontend communicating only through the gateway

**Key Learnings:**
- Microservices enable team collaboration without code conflicts
- API Gateway pattern solves multi-port exposure problems
- MongoDB's flexibility suits microservices well
- Separation of concerns makes systems easier to maintain and scale

**Real-World Relevance:**
This architecture mirrors what companies like Amazon, Netflix, and Uber use in production — proving its practical value beyond academic study.
