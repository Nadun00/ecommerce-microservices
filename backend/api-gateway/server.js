require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const productSwaggerSpec = require('../product-service/swagger/swaggerConfig');
const userSwaggerSpec = require('../user-service/swagger/swaggerConfig');
const cartSwaggerSpec = require('../cart-service/swagger/swaggerConfig');
const orderSwaggerSpec = require('../order-service/swagger/swaggerConfig');
const paymentSwaggerSpec = require('../payment-service/swagger/swaggerConfig');
const gatewaySwaggerSpec = require('./swagger/gatewaySwagger');
const { buildGatewayServiceSpec } = require('./swagger/buildGatewaySpec');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const gatewayBaseUrl = `http://localhost:${PORT}`;

const SERVICES = {
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005'
};

const docsRegistry = [
  { key: 'products', mountPath: '/product-docs', serviceUrl: SERVICES.product, spec: buildGatewayServiceSpec(productSwaggerSpec) },
  { key: 'users', mountPath: '/user-docs', serviceUrl: SERVICES.user, spec: buildGatewayServiceSpec(userSwaggerSpec) },
  { key: 'cart', mountPath: '/cart-docs', serviceUrl: SERVICES.cart, spec: buildGatewayServiceSpec(cartSwaggerSpec) },
  { key: 'orders', mountPath: '/order-docs', serviceUrl: SERVICES.order, spec: buildGatewayServiceSpec(orderSwaggerSpec) },
  { key: 'payments', mountPath: '/payment-docs', serviceUrl: SERVICES.payment, spec: buildGatewayServiceSpec(paymentSwaggerSpec) }
];

app.disable('x-powered-by');

app.use(cors());

// Logging middleware — logs every incoming request to the gateway
app.use((req, res, next) => {
  console.log(`[Gateway] ${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// ============================================================
// API ROUTES — Forward to microservices
// ============================================================

// /gateway/products/* → Product Service
app.use('/gateway/products', createProxyMiddleware({
  target: SERVICES.product,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api/products${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Product Service unavailable', details: err.message });
    }
  }
}));

// /gateway/users/* → User Service
app.use('/gateway/users', createProxyMiddleware({
  target: SERVICES.user,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api/users${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'User Service unavailable', details: err.message });
    }
  }
}));

// /gateway/cart/* → Cart Service
app.use('/gateway/cart', createProxyMiddleware({
  target: SERVICES.cart,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api/cart${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Cart Service unavailable', details: err.message });
    }
  }
}));

// /gateway/orders/* → Order Service
app.use('/gateway/orders', createProxyMiddleware({
  target: SERVICES.order,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api/orders${path === '/' ? '' : path}`;
  },
  on: {
    error: (err, req, res) => {
      res.status(503).json({ error: 'Order Service unavailable', details: err.message });
    }
  }
}));

// /gateway/payments/* → Payment Service
app.use('/gateway/payments', createProxyMiddleware({
  target: SERVICES.payment,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return `/api/payments${path === '/' ? '' : path}`;
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
    service: 'api-gateway',
    port: PORT,
    routes: {
      products: `${gatewayBaseUrl}/gateway/products`,
      users: `${gatewayBaseUrl}/gateway/users`,
      cart: `${gatewayBaseUrl}/gateway/cart`,
      orders: `${gatewayBaseUrl}/gateway/orders`,
      payments: `${gatewayBaseUrl}/gateway/payments`
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

app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: PORT,
    services: SERVICES
  });
});

app.get('/api-docs.json', (req, res) => {
  res.json(gatewaySwaggerSpec);
});

app.get('/openapi.json', (req, res) => {
  res.json(gatewaySwaggerSpec);
});

docsRegistry.forEach(({ mountPath, serviceUrl, spec }) => {
  app.get(`${mountPath}.json`, (req, res) => {
    res.json(spec);
  });

  app.get(`${mountPath}/source`, (req, res) => {
    res.json({
      directDocs: `${serviceUrl}/api-docs`,
      directOpenApi: `${serviceUrl}/api-docs.json`,
      gatewayDocs: `${gatewayBaseUrl}${mountPath}`,
      gatewayOpenApi: `${gatewayBaseUrl}${mountPath}.json`
    });
  });

  app.use(
    mountPath,
    swaggerUi.serveFiles(spec, {}),
    swaggerUi.setup(spec, {
      explorer: true,
      customSiteTitle: `${spec.info.title} via API Gateway`
    })
  );
});

app.use('/api-docs', swaggerUi.serveFiles(gatewaySwaggerSpec, {}), swaggerUi.setup(gatewaySwaggerSpec, {
  explorer: true,
  customSiteTitle: 'E-Commerce API Gateway'
}));

app.use('/docs', swaggerUi.serveFiles(gatewaySwaggerSpec, {}), swaggerUi.setup(gatewaySwaggerSpec, {
  explorer: true,
  customSiteTitle: 'E-Commerce API Gateway'
}));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  API Gateway running on port ${PORT}`);
  console.log(`========================================`);
  console.log(`  Gateway URL:  http://localhost:${PORT}`);
  console.log(`\n  Gateway Routes:`);
  console.log(`  → Products:  http://localhost:${PORT}/gateway/products`);
  console.log(`  → Users:     http://localhost:${PORT}/gateway/users`);
  console.log(`  → Cart:      http://localhost:${PORT}/gateway/cart`);
  console.log(`  → Orders:    http://localhost:${PORT}/gateway/orders`);
  console.log(`  → Payments:  http://localhost:${PORT}/gateway/payments`);
  console.log(`\n  Swagger Docs:`);
  console.log(`  → Products:  http://localhost:${PORT}/product-docs`);
  console.log(`  → Users:     http://localhost:${PORT}/user-docs`);
  console.log(`  → Cart:      http://localhost:${PORT}/cart-docs`);
  console.log(`  → Orders:    http://localhost:${PORT}/order-docs`);
  console.log(`  → Payments:  http://localhost:${PORT}/payment-docs`);
  console.log(`========================================\n`);
});
