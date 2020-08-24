if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Getting Environment Variables
module.exports = {
  PREFIX: process.env.BOT_PREFIX,
  discordToken: process.env.BOT_TOKEN,
  FIREBASE_SERVICE_ACCOUNT_BASE64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
}