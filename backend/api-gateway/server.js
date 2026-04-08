/**
 * ============================================================
 * API GATEWAY - Single Entry Point for All Microservices
 * ============================================================
 *
 * WHY DO WE NEED AN API GATEWAY?
 * --------------------------------
 * In a microservices architecture, each service runs on its OWN port:
 *   - Product Service  → http://localhost:3001
 *   - User Service     → http://localhost:3002
 *   - Cart Service     → http://localhost:3003
 *   - Order Service    → http://localhost:3004
 *   - Payment Service  → http://localhost:3005
 *
 * Without an API Gateway, the React frontend would need to know and call
 * FIVE different ports/URLs. This creates problems:
 *   1. CORS issues on every service
 *   2. Frontend tightly coupled to service locations
 *   3. Hard to change service URLs later
 *   4. Clients exposed to internal architecture
 *
 * HOW THE API GATEWAY SOLVES THIS:
 * ----------------------------------
 * The API Gateway runs on a SINGLE port (5000) and acts as a
 * reverse proxy — it receives all requests and forwards them to
 * the correct microservice internally.
 *
 * The frontend only ever calls: http://localhost:5000
 * The gateway handles routing to the right service behind the scenes.
 *
 * CLIENT → Gateway (:5000) → [Product Service (:3001)]
 *                           → [User Service    (:3002)]
 *                           → [Cart Service    (:3003)]
 *                           → [Order Service   (:3004)]
 *                           → [Payment Service (:3005)]
 *
 * ROUTE MAPPING:
 * ---------------
 * /api/products  → Product Service  (:3001)
 * /api/users     → User Service     (:3002)
 * /api/cart      → Cart Service     (:3003)
 * /api/orders    → Order Service    (:3004)
 * /api/payments  → Payment Service  (:3005)
 *
 * SWAGGER DOCS VIA GATEWAY:
 * --------------------------
 * /product-docs  → Product Service Swagger  (:3001/api-docs)
 * /user-docs     → User Service Swagger     (:3002/api-docs)
 * /cart-docs     → Cart Service Swagger     (:3003/api-docs)
 * /order-docs    → Order Service Swagger    (:3004/api-docs)
 * /payment-docs  → Payment Service Swagger  (:3005/api-docs)
 * ============================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Service URLs (read from .env or use defaults)
const SERVICES = {
  product:  process.env.PRODUCT_SERVICE_URL  || 'http://localhost:3001',
  user:     process.env.USER_SERVICE_URL     || 'http://localhost:3002',
  cart:     process.env.CART_SERVICE_URL     || 'http://localhost:3003',
  order:    process.env.ORDER_SERVICE_URL    || 'http://localhost:3004',
  payment:  process.env.PAYMENT_SERVICE_URL  || 'http://localhost:3005',
};

// Allow all origins (frontend can talk to gateway freely)
app.use(cors());

// Logging middleware — logs every incoming request to the gateway
app.use((req, res, next) => {
  console.log(`[Gateway] ${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// ============================================================
// API ROUTES — Forward to microservices
// ============================================================

// /api/products/* → Product Service (removes /api prefix)
app.use('/api/products', createProxyMiddleware({
  target: SERVICES.product,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/products${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Product Service unavailable', details: err.message });
    }
  }
}));

// /api/users/* → User Service
app.use('/api/users', createProxyMiddleware({
  target: SERVICES.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'User Service unavailable', details: err.message });
    }
  }
}));

// /api/cart/* → Cart Service
app.use('/api/cart', createProxyMiddleware({
  target: SERVICES.cart,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/cart${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Cart Service unavailable', details: err.message });
    }
  }
}));

// /api/orders/* → Order Service
app.use('/api/orders', createProxyMiddleware({
  target: SERVICES.order,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/orders${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Order Service unavailable', details: err.message });
    }
  }
}));

// /api/payments/* → Payment Service
app.use('/api/payments', createProxyMiddleware({
  target: SERVICES.payment,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/payments${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Payment Service unavailable', details: err.message });
    }
  }
}));

// ============================================================
// SWAGGER DOCS PROXY — Access all service docs via gateway
// ============================================================

/*app.use('/product-docs', createProxyMiddleware({
  target: SERVICES.product,
  changeOrigin: true,
  pathRewrite: { '^/product-docs': '/api-docs' },
}));

app.use('/user-docs', createProxyMiddleware({
  target: SERVICES.user,
  changeOrigin: true,
  pathRewrite: { '^/user-docs': '/api-docs' },
}));

app.use('/cart-docs', createProxyMiddleware({
  target: SERVICES.cart,
  changeOrigin: true,
  pathRewrite: { '^/cart-docs': '/api-docs' },
}));

app.use('/order-docs', createProxyMiddleware({
  target: SERVICES.order,
  changeOrigin: true,
  pathRewrite: { '^/order-docs': '/api-docs' },
}));

app.use('/payment-docs', createProxyMiddleware({
  target: SERVICES.payment,
  changeOrigin: true,
  pathRewrite: { '^/payment-docs': '/api-docs' },
})); */

app.use('/product-docs', createProxyMiddleware({
  target: SERVICES.product,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api-docs${path === '/' ? '' : path}`;
  },
}));

app.use('/user-docs', createProxyMiddleware({
  target: SERVICES.user,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api-docs${path === '/' ? '' : path}`;
  },
}));

app.use('/cart-docs', createProxyMiddleware({
  target: SERVICES.cart,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api-docs${path === '/' ? '' : path}`;
  },
}));

app.use('/order-docs', createProxyMiddleware({
  target: SERVICES.order,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api-docs${path === '/' ? '' : path}`;
  },
}));

app.use('/payment-docs', createProxyMiddleware({
  target: SERVICES.payment,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api-docs${path === '/' ? '' : path}`;
  },
}));

// ============================================================
// GATEWAY INFO ROUTES
// ============================================================

// Root: show gateway info and all available routes
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API Gateway',
    port: PORT,
    services: SERVICES,
    routes: {
      products:  `http://localhost:${PORT}/api/products`,
      users:     `http://localhost:${PORT}/api/users`,
      cart:      `http://localhost:${PORT}/api/cart`,
      orders:    `http://localhost:${PORT}/api/orders`,
      payments:  `http://localhost:${PORT}/api/payments`,
    },
    swaggerDocs: {
      products: `http://localhost:${PORT}/product-docs`,
      users:    `http://localhost:${PORT}/user-docs`,
      cart:     `http://localhost:${PORT}/cart-docs`,
      orders:   `http://localhost:${PORT}/order-docs`,
      payments: `http://localhost:${PORT}/payment-docs`,
    }
  });
});

// Health check for gateway itself
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: PORT,
    timestamp: new Date().toISOString(),
    services: SERVICES
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  API Gateway running on port ${PORT}`);
  console.log(`========================================`);
  console.log(`  Gateway URL:  http://localhost:${PORT}`);
  console.log(`\n  API Routes:`);
  console.log(`  → Products:  http://localhost:${PORT}/api/products`);
  console.log(`  → Users:     http://localhost:${PORT}/api/users`);
  console.log(`  → Cart:      http://localhost:${PORT}/api/cart`);
  console.log(`  → Orders:    http://localhost:${PORT}/api/orders`);
  console.log(`  → Payments:  http://localhost:${PORT}/api/payments`);
  console.log(`\n  Swagger Docs:`);
  console.log(`  → Products:  http://localhost:${PORT}/product-docs`);
  console.log(`  → Users:     http://localhost:${PORT}/user-docs`);
  console.log(`  → Cart:      http://localhost:${PORT}/cart-docs`);
  console.log(`  → Orders:    http://localhost:${PORT}/order-docs`);
  console.log(`  → Payments:  http://localhost:${PORT}/payment-docs`);
  console.log(`========================================\n`);
});
