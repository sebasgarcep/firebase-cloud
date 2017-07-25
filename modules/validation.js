'use strict';

const joi = require('joi');

// Validation Middleware
module.exports = (schemaCollection, middleware) => {
  if (!schemaCollection) {
    return middleware;
  }

  let schemaBody = null;
  let schemaQuery = null;
  let schemaParams = null;
  if (schemaCollection.body) {
    schemaBody = joi.object().keys(schemaCollection.body);
  }
  if (schemaCollection.query) {
    schemaQuery = joi.object().keys(schemaCollection.query);
  }
  if (schemaCollection.params) {
    schemaParams = joi.object().keys(schemaCollection.params);
  }

  const validationMiddleware = (req, res, next) => {
    if (schemaParams !== null) {
      const { error, value } = joi.validate(req.params, schemaParams);
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      req.params = value;
    }
    if (schemaQuery !== null) {
      const { error, value } = joi.validate(req.query, schemaQuery);
      if (error !== null) {
        res.status(400).send(error);
        return;
      }
      req.query = value;
    }
    if (schemaBody !== null) {
      const { error, value } = joi.validate(req.body, schemaBody);
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
