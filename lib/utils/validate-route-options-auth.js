// @flow

import type {
  RouteOptionsAuth,
} from '../types';

const validateSchemes = (item: mixed): string => {
  if (typeof item !== 'string') {
    throw new Error('All schemes must be strings in a scheme array');
  }

  return item;
};

const validateRouteOptionsAuth = (auth: mixed): RouteOptionsAuth => {
  if (auth === undefined) {
    return undefined;
  }

  if (auth === false) {
    return false;
  }

  if (typeof auth === 'string') {
    return {
      mode: 'required',
      schemes: [auth],
      scopes: [],
    };
  }

  if (Array.isArray(auth)) {
    const schemes = auth.map(validateSchemes);

    return {
      mode: 'required',
      schemes,
      scopes: [],
    };
  }

  if (auth !== null && typeof auth === 'object') {
    const { mode } = auth;
    let { schemes, scopes } = auth;

    // mode validations
    if (mode !== 'required' && mode !== 'try') {
      throw new Error('mode must be either required or try');
    }

    // schemes validations
    if (typeof schemes === 'string') {
      schemes = [schemes];
    }

    if (!Array.isArray(schemes)) {
      throw new Error('schemes must be either a scheme name or an array of scheme names.');
    }

    if (schemes.length === 0) {
      throw new Error('At least one scheme name must be passed to schemes');
    }

    schemes = schemes.map(validateSchemes);

    // scopes validations
    if (scopes === undefined) {
      scopes = [];
    }

    if (!Array.isArray(scopes)) {
      throw new Error('scopes must be an array or undefined.');
    }

    scopes = scopes.map((item) => {
      if (typeof item !== 'string' && typeof item !== 'function') {
        throw new Error('Scopes must be either strings or functions.');
      }

      return item;
    });

    return {
      mode,
      schemes,
      scopes,
    };
  }

  throw new Error('Auth options must be either undefined, false, a scheme name, an array of scheme names or an auth strategy object.');
};

export default validateRouteOptionsAuth;
