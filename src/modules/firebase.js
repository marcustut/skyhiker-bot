// Firebase Config
const firebase = require('firebase-admin');

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii')
    ))
});

const db = firebase.firestore();

module.exports = {
  firebase: firebase,
  db: db
}