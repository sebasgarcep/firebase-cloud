// @flow

/**
 *
 *    Express/Firebase HTTPS Server
 *
 */

import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

import type {
  ExtsHandlers,
  GlobalAuthenticationConfig,
  Handler,
} from './types';

import configClass from './modules/configuration';
import errorHandler from './middleware/error';
import validateRouteOptionsAuth from './utils/validate-route-options-auth';
import validateServerConfig from './utils/validate-server-config';
import validateRoutePath from './utils/validate-route-path';
import validateRouteOptions from './utils/validate-route-options';

function serverFactory(configDirty: mixed) {
  const config = validateServerConfig(configDirty);

  const app = express();

  app.use(bodyParser.json());
  app.use(compression());
  app.use(cors());

  const exts: ExtsHandlers = {
    onPreAuth: [],
    onPostAuth: [],
    onPreHandler: [],
  };

  const authenticationConfig: GlobalAuthenticationConfig = {
    defaultStrategy: false,
    schemes: {},
  };

  const configMiddleware = configClass(config, authenticationConfig, exts);

  const serverInstance = {};

  const examiner = (handler: Handler): Handler => (req, res) => {
    const result = handler(req, res);
    if (result && result.catch && typeof result.catch === 'function') {
      result.catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.error(error.stack);
        res.sendStatus(500);
      });
    }
  };

  serverInstance.auth = {};

  serverInstance.auth.default = (strategyDirty: mixed = false) => {
    const strategy = validateRouteOptionsAuth(strategyDirty);

    if (strategy === undefined) {
      throw new Error('unreachable');
    }

    if (strategy === false) {
      authenticationConfig.defaultStrategy = false;
      return;
    }

    strategy.mode = strategy.mode || 'required';
    authenticationConfig.defaultStrategy = strategy;
  };

  serverInstance.auth.scheme = (name: mixed, authentication: mixed) => {
    if (typeof name !== 'string') {
      throw new Error('First parameter must be a string name');
    }
    if (typeof authentication !== 'function') {
      throw new Error('Second parameter \'authentication\' must be a function');
    }
    authenticationConfig.schemes[name] = {
      authentication,
    };
  };

  serverInstance.ext = (event: mixed, middleware: mixed) => {
    if (typeof event !== 'string') {
      throw new Error('The name of the extension point must be a string.');
    }

    if (event !== 'onPreAuth' && event !== 'onPostAuth' && event !== 'onPreHandler') {
      throw new Error(`${event} is not a valid extension point.`);
    }

    if (typeof middleware !== 'function') {
      throw new Error('middleware parameter passed to .ext() must be a function');
    }

    const extensionPoint = exts[event];
    extensionPoint.push(middleware);
  };

  serverInstance.get = (pathDirty: mixed, optionsDirty: mixed) => {
    const path = validateRoutePath(pathDirty);
    const options = validateRouteOptions(optionsDirty);
    app.get(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.post = (pathDirty: mixed, optionsDirty: mixed) => {
    const path = validateRoutePath(pathDirty);
    const options = validateRouteOptions(optionsDirty);
    app.post(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.put = (pathDirty: mixed, optionsDirty: mixed) => {
    const path = validateRoutePath(pathDirty);
    const options = validateRouteOptions(optionsDirty);
    app.put(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.delete = (pathDirty: mixed, optionsDirty: mixed) => {
    const path = validateRoutePath(pathDirty);
    const options = validateRouteOptions(optionsDirty);
    app.delete(path, configMiddleware(options), examiner(options.handler));
  };

  serverInstance.getExpress = () => {
    app.use(errorHandler());
    return app;
  };

  serverInstance.decorate = (key: mixed, method: mixed) => {
    if (typeof key !== 'string') {
      throw new Error(`The first parameter of .decorate() must be a string. Instead ${JSON.stringify(key, null, 2)} was provided.`);
    }
    serverInstance[key] = method;
  };

  serverInstance.static = (path: mixed) => {
    app.use(express.static(path));
  };

  serverInstance.plugin = (plugin: mixed) => {
    if (typeof plugin !== 'function') {
      throw new Error('Plugins must be functions that take the serverInstance as parameter.');
    }
    plugin(serverInstance);
  };

  return serverInstance;
}

export default serverFactory;
