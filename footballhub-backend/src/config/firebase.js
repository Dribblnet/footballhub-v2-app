const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const env = require('./env');



// Env-based initialization (keep for production deployment):
if (env.firebase.projectId && env.firebase.privateKey && env.firebase.clientEmail) {
  initializeApp({
    credential: cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });
  console.log('Firebase Admin initialized successfully.');
} else {
  console.warn('Firebase Admin SDK configuration incomplete. Firestore will not work until .env is properly set.');
  // Initialize with default app for local testing without credentials (will fail on actual DB calls if unauthenticated)
  initializeApp();
}

const db = getFirestore();

module.exports = {
  admin,
  db,
};
