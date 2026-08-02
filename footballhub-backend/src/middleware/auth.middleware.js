const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response.util');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'No token provided, authorization denied', 'NO_TOKEN', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return errorResponse(res, 'Token is not valid', 'INVALID_TOKEN', 401);
  }
};

module.exports = authMiddleware;
