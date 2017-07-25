// @flow

import chainMiddlewares from '../utils/chain-middlewares';

import type {
  ComposableMiddleware,
  ExtsHandlers,
} from '../types';

// run these extension middleware before authentication
const onPreAuthMiddlewareFactory =
  (exts: ExtsHandlers, middleware: ComposableMiddleware): ComposableMiddleware =>
    chainMiddlewares(exts.onPreAuth, middleware);

export default onPreAuthMiddlewareFactory;
