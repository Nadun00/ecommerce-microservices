require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const swaggerSpec = require('./swagger/swaggerConfig');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.disable('x-powered-by');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    service: 'product-service',
    port: PORT,
    routes: {
      health: `http://localhost:${PORT}/health`,
      products: `http://localhost:${PORT}/api/products`,
      docs: `http://localhost:${PORT}/api-docs`,
      docsAlt: `http://localhost:${PORT}/docs`,
      openapi: `http://localhost:${PORT}/openapi.json`
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Product Service is running', port: PORT });
});

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/openapi.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
  console.log(`Product API: http://localhost:${PORT}/api/products`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`Swagger docs alt: http://localhost:${PORT}/docs`);
});
