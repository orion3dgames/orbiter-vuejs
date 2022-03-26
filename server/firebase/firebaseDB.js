var admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  project_id: process.env.FIREBASE_PROJECT_ID,
  databaseURL: "https://orbiter-8f3ef-default-rtdb.firebaseio.com"
});

var db = admin.database();
module.exports = db;