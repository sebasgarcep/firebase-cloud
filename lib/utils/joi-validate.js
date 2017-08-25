// @flow

import joi from 'joi';

import type {
  JoiSchema,
  ValidationResult,
} from '../types';

export default function joiValidate<T>(
  target: T,
  schema: JoiSchema,
  options?: {}): ValidationResult<T> {
  return joi.validate(target, schema, options);
}
