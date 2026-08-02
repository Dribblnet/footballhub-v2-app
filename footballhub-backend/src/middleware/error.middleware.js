const { errorResponse } = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  }

  if (err.name === 'UnauthorizedError' || err.code === 'auth/id-token-expired') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
  }

  return errorResponse(res, message, errorCode, statusCode);
};

module.exports = errorHandler;
