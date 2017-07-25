'use strict';

// chain list of composable middleware with an initial middleware
module.exports = (middlewares, initial) => {
  let compose = initial;
  middlewares.forEach((handler) => {
    compose = compose
      .use(handler);
  });
  return compose;
};
