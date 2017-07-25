// @flow

import composable from 'composable-middleware';

import type {
  ComposableMiddleware,
} from '../types';

export default (): ComposableMiddleware => composable();
