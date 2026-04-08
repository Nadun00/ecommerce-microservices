const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cart Service API',
      version: '1.0.0',
      description: 'API documentation for the Cart Microservice'
    },
    tags: [
      { name: 'default', description: 'Service metadata endpoints' },
      { name: 'Health', description: 'Service health monitoring' },
      { name: 'Cart', description: 'Shopping cart endpoints' }
    ],
    servers: [
      { url: 'http://localhost:3003', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['default'],
          summary: 'Service root information',
          operationId: 'getCartServiceRoot',
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
          operationId: 'getCartServiceHealth',
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
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string', example: '6800012345abcdef12345678' },
            name: { type: 'string', example: 'Wireless Headphones' },
            price: { type: 'number', example: 99.99 },
            quantity: { type: 'integer', example: 1 }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6800012345abcdef12345680' },
            userId: { type: 'string', example: 'demo-user-001' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' }
            },
            total: { type: 'number', example: 99.99 }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

module.exports = swaggerJsdoc(options);
