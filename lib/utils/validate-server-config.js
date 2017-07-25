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

  return {};
};

export default validateServerConfig;
