exports.getNextEndpoint = (defaultSequenceEndpoints, currentEndpoint) =>
  (orderEndpoint = { order: defaultSequenceEndpoints }) =>
    orderEndpoint.order.findIndex(endpoint => (endpoint === currentEndpoint)) + 1;
