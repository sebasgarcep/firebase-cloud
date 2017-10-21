// @flow

import joi from 'joi';

import type {
  JoiSchema,
} from '../types';

const joiWrapObjectSchema = (schema: {}): JoiSchema =>
  joi.compile(schema);

export default joiWrapObjectSchema;
