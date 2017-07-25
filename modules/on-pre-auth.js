'use strict';

const chainMiddlewares = require('../utils/chain-middlewares');

// run these extension middleware before authentication
module.exports = (exts, middleware) => chainMiddlewares(exts.onPreAuth, middleware);
