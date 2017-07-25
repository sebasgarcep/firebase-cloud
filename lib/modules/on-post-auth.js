// @flow

import chainMiddlewares from '../utils/chain-middlewares';

import type {
  ComposableMiddleware,
  ExtsHandlers,
} from '../types';

// run these extension middleware after authentication
const onPostAuthMiddlewareFactory =
  (exts: ExtsHandlers, middleware: ComposableMiddleware): ComposableMiddleware =>
    chainMiddlewares(exts.onPostAuth, middleware);

export default onPostAuthMiddlewareFactory;
