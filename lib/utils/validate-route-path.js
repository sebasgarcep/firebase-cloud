// @flow

const validateRoutePath = (pathDirty: mixed): string => {
  if (typeof pathDirty !== 'string') {
    throw new Error(`Route path must be a string. Instead ${JSON.stringify(pathDirty, null, 2)} was provided.`);
  }

  return pathDirty;
};

export default validateRoutePath;
