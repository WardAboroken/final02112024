// utils/paypal.js

require("dotenv").config({ path: "./paypalInfo.env" }); // Load environment variables
const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID, // Client ID from .env file
  process.env.PAYPAL_SECRET // Secret from .env file
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };
