require("dotenv").config({
  path: '.env'
});

// Get custom env vars from .env and make them accessible by the app
module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_KEY: process.env.API_KEY,
    API_AUTH_URL: process.env.API_AUTH_URL,
  },
};
