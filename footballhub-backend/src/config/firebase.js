const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
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
  initializeApp();
}

const db = getFirestore();
const auth = getAuth();

module.exports = {
  auth,
  db,
};
