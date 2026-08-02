require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  msg91: {
    authToken: process.env.MSG91_AUTH_TOKEN,
    templateId: process.env.MSG91_TEMPLATE_ID,
    senderId: process.env.MSG91_SENDER_ID,
  },
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
};

// Check for required env vars
const missingVars = [];
if (!env.firebase.projectId) missingVars.push('FIREBASE_PROJECT_ID');
if (!env.msg91.authToken) missingVars.push('MSG91_AUTH_TOKEN');
if (!env.jwtSecret || env.jwtSecret === 'fallback_secret_do_not_use_in_prod') {
  console.warn('WARNING: Using default JWT_SECRET. Please set one in .env');
}

if (missingVars.length > 0) {
  console.warn(`WARNING: Missing environment variables: ${missingVars.join(', ')}`);
}

module.exports = env;
