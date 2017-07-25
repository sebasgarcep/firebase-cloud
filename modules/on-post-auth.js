'use strict';

const chainMiddlewares = require('../utils/chain-middlewares');

// run these extension middleware after authentication
module.exports = (exts, middleware) => chainMiddlewares(exts.onPostAuth, middleware);
