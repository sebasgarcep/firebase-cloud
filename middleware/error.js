'use strict';

// Error Handling Middleware
module.exports = () => (error, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(error.stack); // eslint-disable-line no-console
  res.sendStatus(500);
};
