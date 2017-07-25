// @flow

import type {
  $Request,
  $Response,
  NextFunction as ExpressNextFunction,
} from 'express';

export type Path = string;

export type AuthenticationMode = 'required' | 'try';

export type Request = {
  auth?: {
    isAuthenticated: boolean,
    scopeCheck: boolean,
    credentials: {} | null,
    mode: AuthenticationMode,
  },
  body: {},
} & $Request;

export type Response = $Response;

export type NextFunction = ExpressNextFunction;

export type Middleware = (req: Request, res: Response, next: NextFunction) => mixed;
export type ErrorMiddleware =
  (error: ?Error, req: Request, res: Response, next: NextFunction) => mixed;
export type Handler = (req: Request, res: Response) => mixed;

export type ComposableMiddleware = {
  use: (composeWith: Middleware) => ComposableMiddleware,
} & Middleware;

export type ValidationResult<T> =
  | { error: null, value: T }
  | { error: {}, value: T };

export type ExtsHandlers = {
  onPreAuth: Array<Middleware>,
  onPostAuth: Array<Middleware>,
  onPreHandler: Array<Middleware>,
};

export type ServerConfig = {};

export type AuthStrategy = {
  mode: AuthenticationMode,
  schemes: Array<string>,
  scopes?: Array<string | (req: Request) => string>,
};

export type RouteOptionsAuth =
  | void
  | false
  | AuthStrategy;

export type RouteOptions = {
  auth: RouteOptionsAuth,
  pre?: Array<Middleware>,
  handler: Handler,
  validate?: {
    body?: {},
    query?: {},
    params?: {},
  },
};

export type AuthResolve = false | {};
export type AuthFunction = (req: Request, res: Response) => Promise<AuthResolve> | AuthResolve;

export type GlobalAuthenticationConfig = {
  defaultStrategy: false | AuthStrategy,
  schemes: {
    [name: string]: {
      authentication: AuthFunction,
    },
  },
};

export type JoiSchema = {};
