// @flow

import type {
  ComposableMiddleware,
  Middleware,
  RouteOptions,
  ServerConfig,
} from '../types';

import joiValidate from '../utils/joi-validate';
import joiWrapObjectSchema from '../utils/joi-wrap-object-schema';

type ServerValidationConfig = $PropertyType<ServerConfig, 'validate'>;
type Schema = $PropertyType<RouteOptions, 'validate'>;

// Validation Middleware
const validationMiddlewareFactory =
  (config: ServerValidationConfig, schemaCollection: Schema, middleware: ComposableMiddleware) => {
    if (!schemaCollection) {
      return middleware;
    }

    let schemaBody = null;
    let schemaQuery = null;
    let schemaParams = null;
    if (schemaCollection.body) {
      schemaBody = joiWrapObjectSchema(schemaCollection.body);
    }
    if (schemaCollection.query) {
      schemaQuery = joiWrapObjectSchema(schemaCollection.query);
    }
    if (schemaCollection.params) {
      schemaParams = joiWrapObjectSchema(schemaCollection.params);
    }

    const validationMiddleware: Middleware = (req, res, next) => {
      if (schemaParams !== null) {
        const { error, value } = joiValidate(req.params, schemaParams, config);
        if (error !== null) {
          res.status(400).send(error);
          return;
        }
        req.params = value;
      }
      if (schemaQuery !== null) {
        const { error, value } = joiValidate(req.query, schemaQuery, config);
        if (error !== null) {
          res.status(400).send(error);
          return;
        }
        req.query = value;
      }
      if (schemaBody !== null) {
        const { error, value } = joiValidate(req.body, schemaBody, config);
        if (error !== null) {
          res.status(400).send(error);
          return;
        }
        req.body = value;
      }

      next();
    };

    return middleware
      .use(validationMiddleware);
  };

export default validationMiddlewareFactory;
