// @flow

import type {
  ExtsHandlers,
  GlobalAuthenticationConfig,
  ServerConfig,
  RouteOptions,
} from '../types';

import composable from '../utils/composable-middleware';
import authentication from './authentication';
import pre from './pre';
import onPreAuth from './on-pre-auth';
import onPreHandler from './on-pre-handler';
import onPostAuth from './on-post-auth';
import validation from './validation';

// Configuration middleware
const configurationMiddlewareFactory =
  (config: ServerConfig, authenticationConfig: GlobalAuthenticationConfig, exts: ExtsHandlers) =>
  (options: RouteOptions) => {
    let middleware = composable();

    // run these extension middleware before authentication
    middleware = onPreAuth(exts, middleware);

    // run authentication
    middleware = authentication(authenticationConfig, options.auth, middleware);

    // run these extension middleware after authentication
    middleware = onPostAuth(exts, middleware);

    // validate the request
    middleware = validation(config.validate, options.validate, middleware);

    // run before the handler and handler-specific middleware
    middleware = onPreHandler(exts, middleware);

    // run right before the handler
    middleware = pre(options.pre, middleware);

    return middleware;
  };

export default configurationMiddlewareFactory;
