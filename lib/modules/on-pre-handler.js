// @flow

import chainMiddlewares from '../utils/chain-middlewares';

import type {
  ComposableMiddleware,
  ExtsHandlers,
} from '../types';

// run before the handler and handler-specific middleware
const onPreHandlerMiddlewareFactory =
  (exts: ExtsHandlers, middleware: ComposableMiddleware): ComposableMiddleware =>
    chainMiddlewares(exts.onPreHandler, middleware);

export default onPreHandlerMiddlewareFactory;
