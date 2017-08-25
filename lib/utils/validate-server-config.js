// @flow

import type {
  ServerConfig,
} from '../types';

const validateServerConfig = (configDirty: mixed): ServerConfig => {
  if (configDirty === undefined) {
    return {};
  }

  if (configDirty === null || typeof configDirty !== 'object') {
    throw new Error('The server configuration must be \'undefined\' or an object.');
  }

  const { validate } = configDirty;
  if (validate !== undefined) {
    if (typeof validate !== 'object' || validate === null) {
      throw new Error('The server validation setting must be \'undefined\' or an object.');
    }

    if (validate.abortEarly !== undefined && typeof validate.abortEarly !== 'boolean') {
      throw new Error('The server validation subsetting \'abortEarly\' must be \'undefined\' or a boolean.');
    }
  }

  return {
    validate,
  };
};

export default validateServerConfig;
