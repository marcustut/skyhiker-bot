// Firebase Config
const firebase = require('firebase-admin');

// Firebase Credentials in base64 from env var
const { FIREBASE_SERVICE_ACCOUNT_BASE64 } = require('../../config');

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(
      Buffer.from(FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii')
    ))
});

const db = firebase.firestore();

module.exports = {
  firebase: firebase,
  db: db
}