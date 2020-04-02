require("dotenv").config({
  path: '.env'
});

// Get custom env vars from .env and make them accessible by the app
module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_KEY: process.env.API_KEY,
    API_AUTH_URL: process.env.API_AUTH_URL,

    FIRESTORE_BASE_URL: process.env.FIRESTORE_BASE_URL,

    FIREBASE_CONFIG_API_KEY: process.env.FIREBASE_CONFIG_API_KEY,
    FIREBASE_CONFIG_AUTH_DOMAIN: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
    FIREBASE_CONFIG_DATABASE_URL: process.env.FIREBASE_CONFIG_DATABASE_URL,
    FIREBASE_CONFIG_PROJECT_ID: process.env.FIREBASE_CONFIG_PROJECT_ID,
    FIREBASE_CONFIG_STORAGE_BUCKET: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
    FIREBASE_CONFIG_MESSAGING_SENDER_ID: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    FIREBASE_CONFIG_APP_ID: process.env.FIREBASE_CONFIG_APP_ID,
    FIREBASE_CONFIG_MEASUREMENT_ID: process.env.FIREBASE_CONFIG_MEASUREMENT_ID,
  },
};