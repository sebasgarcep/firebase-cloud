// @flow

import type { Request, Response, NextFunction } from '../types';

// Error Handling Middleware
const internalServerErrorMiddlewareFactory = () =>
  // eslint-disable-next-line no-unused-vars
  (error: ?Error, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      console.error(error.stack); // eslint-disable-line no-console
      res.sendStatus(500);
    }
  };

export default internalServerErrorMiddlewareFactory;
