const productSwaggerSpec = require('../../product-service/swagger/swaggerConfig');
const userSwaggerSpec = require('../../user-service/swagger/swaggerConfig');
const cartSwaggerSpec = require('../../cart-service/swagger/swaggerConfig');
const orderSwaggerSpec = require('../../order-service/swagger/swaggerConfig');
const paymentSwaggerSpec = require('../../payment-service/swagger/swaggerConfig');
const { buildGatewayServiceSpec } = require('./buildGatewaySpec');

const serviceSpecs = [
  productSwaggerSpec,
  userSwaggerSpec,
  cartSwaggerSpec,
  orderSwaggerSpec,
  paymentSwaggerSpec
];
const gatewayServiceSpecs = serviceSpecs.map(buildGatewayServiceSpec);

function mergeUniqueTags(specs) {
  const map = new Map();

  specs.forEach((spec) => {
    (spec.tags || []).forEach((tag) => {
      if (!map.has(tag.name)) {
        map.set(tag.name, tag);
      }
    });
  });

  return Array.from(map.values());
}

function mergeComponents(specs) {
  return specs.reduce(
    (acc, spec) => {
      const schemas = (spec.components && spec.components.schemas) || {};
      acc.schemas = { ...acc.schemas, ...schemas };
      return acc;
    },
    { schemas: {} }
  );
}

function mergePaths(specs) {
  return specs.reduce((acc, spec) => ({ ...acc, ...spec.paths }), {});
}

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API Gateway',
    version: '1.0.0',
    description: 'Combined API documentation for all e-commerce microservices via the API Gateway'
  },
  servers: [
    { url: 'http://localhost:5000', description: 'API Gateway' }
  ],
  tags: mergeUniqueTags(gatewayServiceSpecs),
  paths: {
    '/': {
      get: {
        tags: ['default'],
        summary: 'Gateway root information',
        operationId: 'getGatewayRoot',
        responses: {
          200: {
            description: 'Gateway metadata'
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Gateway health check',
        operationId: 'getGatewayHealth',
        responses: {
          200: {
            description: 'Gateway health status'
          }
        }
      }
    },
    ...mergePaths(gatewayServiceSpecs)
  },
  components: mergeComponents(gatewayServiceSpecs)
};
