const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'API documentation for the Payment Microservice'
    },
    tags: [
      { name: 'default', description: 'Service metadata endpoints' },
      { name: 'Health', description: 'Service health monitoring' },
      { name: 'Payments', description: 'Payment management endpoints' }
    ],
    servers: [
      { url: 'http://localhost:3005', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['default'],
          summary: 'Service root information',
          operationId: 'getPaymentServiceRoot',
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
          operationId: 'getPaymentServiceHealth',
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
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6800012345abcdef12345682' },
            orderId: { type: 'string', example: '6800012345abcdef12345681' },
            amount: { type: 'number', example: 99.99 },
            paymentMethod: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
              example: 'credit_card'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              example: 'completed'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

module.exports = swaggerJsdoc(options);
