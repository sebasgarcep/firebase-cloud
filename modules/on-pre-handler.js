'use strict';

const chainMiddlewares = require('../utils/chain-middlewares');

// run before the handler and handler-specific middleware
module.exports = (exts, middleware) => chainMiddlewares(exts.onPreHandler, middleware);
