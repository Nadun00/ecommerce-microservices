const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'API documentation for the User Microservice'
    },
    servers: [
      { url: 'http://localhost:3002', description: 'Direct service access' },
      { url: 'http://localhost:5000', description: 'Via API Gateway' }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
