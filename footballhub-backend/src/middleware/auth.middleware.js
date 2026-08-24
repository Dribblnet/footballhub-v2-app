const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/response.util');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'No token provided, authorization denied', 'NO_TOKEN', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    console.log(`[AUTH MIDDLEWARE] Success: Backend JWT verified for UID: ${decoded.uid}`);
    return next();
  } catch (jwtError) {
    console.log(`[AUTH MIDDLEWARE] Backend JWT verification failed: ${jwtError.message}. Attempting Firebase fallback...`);
    try {
      const { auth } = require('../config/firebase');
      const decodedFirebase = await auth.verifyIdToken(token);
      req.user = {
         uid: decodedFirebase.uid,
         email: decodedFirebase.email,
         role: 'PLAYER'
      };
      console.log(`[AUTH MIDDLEWARE] Success: Firebase ID token verified for UID: ${decodedFirebase.uid}`);
      return next();
    } catch (firebaseErr) {
      console.error(`[AUTH MIDDLEWARE ERROR] Firebase fallback failed: ${firebaseErr.message}`);
      return errorResponse(res, 'Token is not valid', 'INVALID_TOKEN', 401);
    }
  }
};

module.exports = authMiddleware;
