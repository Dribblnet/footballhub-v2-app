const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

class UserService {
  constructor() {
    this.collection = 'users';
  }

  async findByPhoneNumber(phoneNumber) {
    const snapshot = await db.collection(this.collection).where('phoneNumber', '==', phoneNumber).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findByEmail(email) {
    const snapshot = await db.collection(this.collection).where('email', '==', email).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findById(uid) {
    const doc = await db.collection(this.collection).doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async updateUser(uid, data) {
    const userRef = db.collection(this.collection).doc(uid);
    // Remove id from data if it exists to avoid overwriting doc id
    const { id, ...updateData } = data;
    await userRef.set({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    return this.findById(uid);
  }

  async createUser(phoneNumber) {
    // Generate a unique UID
    const newDocRef = db.collection(this.collection).doc();
    const uid = newDocRef.id;

    const userData = {
      uid,
      phoneNumber,
      displayName: null,
      age: null,
      preferredPosition: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      totalMatches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      hatTricks: 0,
      playerOfTheMatchAwards: 0,
      ratingAverage: 0.0,
      isVerified: true, // Verified by OTP
      role: 'PLAYER',
    };

    await newDocRef.set(userData);
    
    // We return the simulated created object, but without the server Timestamp 
    // exact value since it's computed on the server.
    return { id: uid, ...userData, createdAt: new Date(), updatedAt: new Date() };
  }

  async createUserByEmail(email) {
    // Generate a unique UID
    const newDocRef = db.collection(this.collection).doc();
    const uid = newDocRef.id;

    const userData = {
      uid,
      email,
      displayName: null,
      age: null,
      preferredPosition: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      totalMatches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      hatTricks: 0,
      playerOfTheMatchAwards: 0,
      ratingAverage: 0.0,
      isVerified: true, // Verified by OTP
      role: 'PLAYER',
    };

    await newDocRef.set(userData);
    
    // We return the simulated created object, but without the server Timestamp 
    // exact value since it's computed on the server.
    return { id: uid, ...userData, createdAt: new Date(), updatedAt: new Date() };
  }

  async createUserByEmailWithUid(email, uid) {
    const newDocRef = db.collection(this.collection).doc(uid);

    const userData = {
      uid,
      email,
      displayName: null,
      age: null,
      preferredPosition: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      totalMatches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      hatTricks: 0,
      playerOfTheMatchAwards: 0,
      ratingAverage: 0.0,
      isVerified: true, // Verified by OTP
      role: 'PLAYER',
    };

    await newDocRef.set(userData);
    
    return { id: uid, ...userData, createdAt: new Date(), updatedAt: new Date() };
  }
}

module.exports = new UserService();
