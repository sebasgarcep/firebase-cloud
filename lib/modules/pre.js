// @flow

import chainMiddlewares from '../utils/chain-middlewares';

import type {
  ComposableMiddleware,
  Middleware,
} from '../types';

// run right before the handler
const preMiddlewareFactory =
  (pre: Array<Middleware> | void, middleware: ComposableMiddleware): ComposableMiddleware => {
    if (!pre) {
      return middleware;
    }

    return chainMiddlewares(pre, middleware);
  };

export default preMiddlewareFactory;
