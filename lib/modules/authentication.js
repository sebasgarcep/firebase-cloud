// @flow

import type {
  AuthFunction,
  AuthStrategy,
  AuthResolve,
  ComposableMiddleware,
  GlobalAuthenticationConfig,
  Request,
  Response,
  RouteOptionsAuth,
  NextFunction,
} from '../types';

const mergeDefaultStrategyWithRouteStrategy =
  (config: AuthStrategy | false, route: AuthStrategy | void): AuthStrategy => {
    if (route === undefined) {
      if (config === false) {
        throw new Error('unreachable');
      }

      return config;
    }

    return route;
  };

/*
  each authentication function takes the request and the response and should
  return an object or a Promise-wrapped object if the authentication succeeded
  or false if the authentication failed.
*/
const authenticationMiddlewareFactory = (
  config: GlobalAuthenticationConfig,
  options: RouteOptionsAuth,
  middleware: ComposableMiddleware): ComposableMiddleware => {
  // perform no authentication
  if (options === false) {
    return middleware;
  }

  const { defaultStrategy, schemes } = config;

  // no authentication scheme is registered as default
  // and the user provides no authentication scheme for this route
  if (defaultStrategy === false && !options) {
    return middleware;
  }

  const finalStrategy = mergeDefaultStrategyWithRouteStrategy(defaultStrategy, options);

  // sanity check
  if (finalStrategy.schemes.length === 0) {
    throw new Error('unreachable');
  }

  finalStrategy.schemes.forEach((scheme) => {
    if (!schemes[scheme]) {
      throw new Error(`${scheme} is not a valid scheme`);
    }
  });

  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authenticationList = finalStrategy.schemes.map(name => schemes[name].authentication);

    type Accumulator = Promise<boolean | {}>;

    const resolution = authenticationList
      .reduce((acc: Accumulator, authentication: AuthFunction) => {
        const job = (): AuthResolve => {
          try {
            return Promise.resolve(authentication(req, res))
              .catch(() => false);
          } catch (error) {
            return Promise.resolve(false);
          }
        };

        return acc.then((result) => {
          if (result === false) {
            return job();
          }
          return result;
        });
      }, Promise.resolve(true));

    resolution
      .then((result) => {
        if (result === true) {
          throw new Error('unreachable');
        }

        type AuthObject = * & {
          credentials: {} | null,
        };

        const auth: AuthObject = {
          isAuthenticated: false,
          scopeCheck: false,
          credentials: null,
          mode: finalStrategy.mode,
        };

        const finish = () => {
          req.auth = auth;
          next();
        };

        if (result === false) {
          if (finalStrategy.mode === 'required') {
            res.sendStatus(401);
            return;
          }

          if (finalStrategy.mode === 'try') {
            finish();
            return;
          }

          return;
        }

        auth.isAuthenticated = true;
        auth.scopeCheck = true;
        auth.credentials = result;

        const { scopes } = finalStrategy;

        if (!scopes) {
          finish();
          return;
        }

        const authScopes = (auth.credentials && auth.credentials.scopes) || null;

        let scopeComparator: (scopeValue: string) => boolean;
        if (authScopes !== null && typeof authScopes === 'object') {
          if (Array.isArray(authScopes)) {
            scopeComparator = scopeValue => authScopes.includes(scopeValue);
          } else {
            scopeComparator = scopeValue => !!authScopes[scopeValue];
          }
        } else {
          scopeComparator = () => false;
        }

        // eslint-disable-next-line
        for (const scope of scopes) {
          let scopeValue;

          if (typeof scope === 'string') {
            scopeValue = scope;
          } else if (typeof scope === 'function') {
            scopeValue = scope(req);
          } else {
            throw new Error('unreachable');
          }

          auth.scopeCheck = auth.scopeCheck && scopeComparator(scopeValue);
        }

        if (!auth.scopeCheck && finalStrategy.mode === 'required') {
          res.sendStatus(403);
          return;
        }

        finish();
      });
  };

  return middleware
    .use(authMiddleware);
};

export default authenticationMiddlewareFactory;
