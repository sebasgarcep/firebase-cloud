'use strict';

const chainMiddlewares = require('../utils/chain-middlewares');

// run right before the handler
module.exports = (pre, middleware) => {
  if (!pre) {
    return middleware;
  }

  return chainMiddlewares(pre, middleware);
};
