'use strict';

const validateAuthStrategy = require('../utils/validate-auth-strategy');

const convertStrategyNameToConfig = (strategy) => {
  if (typeof strategy !== 'string') {
    return strategy;
  }

  return {
    mode: 'required',
    schemes: [strategy],
  };
};

const mergeDefaultStrategyWithRouteStrategy = (config, routeDirty) => {
  if (routeDirty === undefined) {
    return convertStrategyNameToConfig(config);
  }

  const route = validateAuthStrategy(routeDirty);

  if (typeof route !== 'object' || typeof config !== 'object') {
    return convertStrategyNameToConfig(route);
  }

  return {
    mode: route.mode || config.mode,
    schemes: route.schemes || config.schemes,
    scopes: route.scopes || config.scopes || [],
  };
};

/*
  each authentication function takes the request and the response and should
  return an object or a Promise-wrapped object if the authentication succeeded
  or false if the authentication failed.
*/
module.exports = (config, options, middleware) => {
  const { defaultStrategy, schemes } = config;
  const finalStrategy =
    mergeDefaultStrategyWithRouteStrategy(defaultStrategy, options);

  finalStrategy.schemes.forEach((scheme) => {
    if (!schemes[scheme]) {
      throw new Error(`${scheme} is not a valid scheme`);
    }
  });

  if (finalStrategy === false) {
    return middleware;
  }

  const authMiddleware = (req, res, next) => {
    const authenticationList = finalStrategy.schemes.map(name =>
      schemes[name].authentication);

    if (authenticationList.length === 0) {
      next();
      return;
    }

    const resolution = authenticationList.reduce((acc, authentication) => {
      const job = () => {
        try {
          return Promise.resolve(authentication(req, res))
            .catch(() => false);
        } catch (error) {
          return Promise.resolve(false);
        }
      };

      if (acc === null) {
        return job();
      }

      return acc.then((result) => {
        if (result === false) {
          return job();
        }
        return result;
      });
    }, null);

    resolution
      .then((result) => {
        if (result === false) {
          if (finalStrategy.mode === 'required') {
            res.sendStatus(401);
            return;
          }

          if (finalStrategy.mode === 'try') {
            next();
            return;
          }
        }

        Object.assign(req.credentials, result);

        // CHECK FOR SCOPES IN req.credentials.scopes
        // eslint-disable-next-line
        for (const scope of finalStrategy.scopes) {
          let scopeValue;

          if (typeof scope === 'string') {
            scopeValue = scope;
          }

          if (typeof scope === 'function') {
            scopeValue = scope(req, res);
          }

          if (Array.isArray(req.credentials.scopes)) {
            if (!req.credentials.scopes.includes(scopeValue)) {
              res.sendStatus(401);
              return;
            }
          } else if (typeof req.credentials.scopes === 'object') {
            if (!req.credentials.scopes[scopeValue]) {
              res.sendStatus(401);
              return;
            }
          } else {
            next('Scopes are not valid, they must be an object.');
            return;
          }
        }

        next();
      });
  };

  return middleware
    .use(authMiddleware);
};
