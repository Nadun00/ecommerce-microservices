const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'API documentation for the Order Microservice'
    },
    servers: [
      { url: 'http://localhost:3004', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
