'use strict';

const composable = require('composable-middleware');

const authentication = require('./authentication');
const pre = require('./pre');
const onPreAuth = require('./on-pre-auth');
const onPreHandler = require('./on-pre-handler');
const onPostAuth = require('./on-post-auth');
const validation = require('./validation');

// Configuration middleware
module.exports = (config, authenticationConfig, exts) => (options) => {
  let middleware = composable();

  // run these extension middleware before authentication
  middleware = onPreAuth(exts, middleware);

  // run authentication
  middleware = authentication(authenticationConfig, options.auth, middleware);

  // run these extension middleware after authentication
  middleware = onPostAuth(exts, middleware);

  // validate the request
  middleware = validation(options.validate, middleware);

  // run before the handler and handler-specific middleware
  middleware = onPreHandler(exts, middleware);

  // run right before the handler
  middleware = pre(options.pre, middleware);

  return middleware;
};
