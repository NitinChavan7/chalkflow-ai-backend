const Groq = require('groq-sdk');
let client;
function getGroq() {
  if (!process.env.GROQ_API_KEY || !process.env.GROQ_MODEL) throw new Error('GROQ_API_KEY and GROQ_MODEL are required');
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 30000, maxRetries: 0 });
  return client;
}
module.exports = { getGroq };
