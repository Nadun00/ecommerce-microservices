const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'API documentation for the Product Microservice'
    },
    tags: [
      { name: 'default', description: 'Service metadata endpoints' },
      { name: 'Health', description: 'Service health monitoring' },
      { name: 'Products', description: 'Product management endpoints' }
    ],
    servers: [
      { url: 'http://localhost:3001', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['default'],
          summary: 'Service root information',
          operationId: 'getProductServiceRoot',
          responses: {
            200: {
              description: 'Service metadata'
            }
          }
        }
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          operationId: 'getProductServiceHealth',
          responses: {
            200: {
              description: 'Service health status'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6800012345abcdef12345678' },
            name: { type: 'string', example: 'Wireless Headphones' },
            price: { type: 'number', example: 99.99 },
            description: { type: 'string', example: 'High quality wireless headphones' },
            category: { type: 'string', example: 'Electronics' },
            stock: { type: 'integer', example: 50 },
            imageUrl: { type: 'string', example: 'https://via.placeholder.com/300' }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

module.exports = swaggerJsdoc(options);
