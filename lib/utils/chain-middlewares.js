// @flow

import type {
  ComposableMiddleware,
  Middleware,
} from '../types';

// chain list of composable middleware with an initial middleware
const chainMiddleware =
  (middlewares: Array<Middleware>, initial: ComposableMiddleware): ComposableMiddleware => {
    let compose = initial;
    middlewares.forEach((handler) => {
      compose = compose
        .use(handler);
    });
    return compose;
  };

export default chainMiddleware;
