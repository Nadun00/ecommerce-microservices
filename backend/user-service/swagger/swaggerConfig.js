const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'API documentation for the User Microservice'
    },
    tags: [
      { name: 'default', description: 'Service metadata endpoints' },
      { name: 'Health', description: 'Service health monitoring' },
      { name: 'Users', description: 'User management endpoints' }
    ],
    servers: [
      { url: 'http://localhost:3002', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['default'],
          summary: 'Service root information',
          operationId: 'getUserServiceRoot',
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
          operationId: 'getUserServiceHealth',
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
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6800012345abcdef12345679' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            address: { type: 'string', example: '123 Main St, City' }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

module.exports = swaggerJsdoc(options);
