// @flow

import joi from 'joi';

import type {
  JoiSchema,
} from '../types';

const joiWrapObjectSchema = (schema: {}): JoiSchema =>
  joi.object().keys(schema);

export default joiWrapObjectSchema;
