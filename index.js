'use strict';

/*
*
*    Express/Firebase HTTPS Server
*
*/

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

const configClass = require('./modules/configuration');
const errorHandler = require('./middleware/error');
const validateAuthStrategy = require('./utils/validate-auth-strategy');

module.exports = function server(config) {
  const app = express();

  app.use(bodyParser.json());
  app.use(compression());
  app.use(cors());

  const exts = {
    onPreAuth: [],
    onPostAuth: [],
    onPreHandler: [],
  };

  const authenticationConfig = {
    defaultStrategy: false,
    schemes: {},
  };

  const configMiddleware = configClass(config, authenticationConfig, exts);

  const serverInstance = {};

  const examiner = handler => (req, res) => {
    const result = handler(req, res);
    if (result && result.then && typeof result.catch === 'function') {
      result.catch((error) => {
        console.error(error.stack); // eslint-disable-line no-console
        res.sendStatus(500);
      });
    }
  };

  serverInstance.auth = {};

  serverInstance.auth.default = (strategyDirty = false) => {
    const strategy = validateAuthStrategy(strategyDirty);
    strategy.mode = strategy.mode || 'required';
    if (!Array.isArray(strategy.schemes) || strategy.schemes.length === 0) {
      throw new Error('\'schemes\' must be an array of length at least 1');
    }
    authenticationConfig.defaultStrategy = strategy;
  };

  serverInstance.auth.scheme = (name, authentication) => {
    if (typeof authentication !== 'function') {
      throw new Error('Second parameter \'authentication\' must be a function');
    }
    authenticationConfig.schemes[name] = {
      authentication,
    };
  };

  serverInstance.ext = (event, middleware) => {
    const extensionPoint = exts[event];
    if (!extensionPoint) {
      throw new Error(`${event} is not a valid extension point.`);
    }
    extensionPoint.push(middleware);
  };

  serverInstance.get = (path, options) => {
    app.get(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.post = (path, options) => {
    app.post(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.put = (path, options) => {
    app.put(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.delete = (path, options) => {
    app.delete(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.patch = (path, options) => {
    app.patch(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.getExpress = () => {
    app.use(errorHandler());
    return app;
  };

  serverInstance.decorate = (key, method) => {
    serverInstance[key] = method;
  };

  serverInstance.use = (middleware) => {
    app.use(middleware);
  };

  serverInstance.static = (path) => {
    app.use(express.static(path));
  };

  serverInstance.plugin = (plugin) => {
    plugin(serverInstance);
  };

  return serverInstance;
};
