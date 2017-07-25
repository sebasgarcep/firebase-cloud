'use strict';

const joi = require('joi');

const strategySchema = joi.alternatives().try(
  joi.any().valid(false),
  joi.string().min(1),
  joi.object().keys({
    mode: joi.any()
      .valid('required', 'try')
      .optional(),
    schemes: joi.array()
      .items(joi.string().min(1))
      .single()
      .min(1)
      .optional(),
    scopes: joi.array()
      .items(
        joi.string().min(1),
        joi.func())
      .optional(),
  })).optional();

module.exports = (strategy) => {
  const { error, value } = joi.validate(strategy, strategySchema);
  if (error !== null) {
    throw error;
  }
  return value;
};
