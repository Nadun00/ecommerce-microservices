function rewriteGatewayPath(pathKey) {
  return pathKey.replace(/^\/api\//, '/gateway/');
}

function extractGatewayPaths(spec) {
  return Object.entries(spec.paths || {}).reduce((acc, [pathKey, pathConfig]) => {
    if (pathKey.startsWith('/api/')) {
      acc[rewriteGatewayPath(pathKey)] = pathConfig;
    }

    return acc;
  }, {});
}

function buildGatewayServiceSpec(spec) {
  return {
    ...spec,
    servers: [
      { url: 'http://localhost:5000', description: 'API Gateway access' }
    ],
    paths: extractGatewayPaths(spec)
  };
}

module.exports = {
  buildGatewayServiceSpec,
  extractGatewayPaths,
  rewriteGatewayPath
};
