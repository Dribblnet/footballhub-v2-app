require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '') : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
};

// Check for required env vars
const missingVars = [];
if (!env.firebase.projectId) missingVars.push('FIREBASE_PROJECT_ID');
if (!env.jwtSecret || env.jwtSecret === 'fallback_secret_do_not_use_in_prod') {
  console.warn('WARNING: Using default JWT_SECRET. Please set one in .env');
}

if (missingVars.length > 0) {
  console.warn(`WARNING: Missing environment variables: ${missingVars.join(', ')}`);
}

module.exports = env;
