// @flow

import type {
  RouteOptions,
} from '../types';

import validateRouteOptionsAuth from './validate-route-options-auth';

const validateRouteOptions = (optionsDirty: mixed): RouteOptions => {
  if (optionsDirty === null || typeof optionsDirty !== 'object') {
    throw new Error(`Route options must be an object. Instead ${JSON.stringify(optionsDirty, null, 2)} was provided.`);
  }

  let pre = optionsDirty.pre;
  if (pre !== undefined) {
    if (!Array.isArray(pre)) {
      throw new Error('options.pre must be undefined or an array of middleware');
    }

    pre = pre.map((middleware) => {
      if (typeof middleware !== 'function') {
        throw new Error('options.pre must be undefined or an array of middleware');
      }

      return middleware;
    });
  }

  const validate = optionsDirty.validate;
  if (validate !== undefined && (validate === null || typeof validate !== 'object')) {
    throw new Error('options.validate must be undefined or an object.');
  }
  if (validate && validate.body !== undefined &&
    (validate.body === null || typeof validate.body !== 'object')) {
    throw new Error('options.validate.body must be undefined or an object.');
  }
  if (validate && validate.query !== undefined &&
    (validate.query === null || typeof validate.query !== 'object')) {
    throw new Error('options.validate.query must be undefined or an object.');
  }
  if (validate && validate.params !== undefined &&
    (validate.params === null || typeof validate.params !== 'object')) {
    throw new Error('options.validate.params must be undefined or an object.');
  }

  const handler = optionsDirty.handler;
  if (typeof handler !== 'function') {
    throw new Error('options.handler must be a function');
  }

  const auth = validateRouteOptionsAuth(optionsDirty.auth);

  return {
    auth,
    pre,
    handler,
    validate,
  };
};

export default validateRouteOptions;
