require('dotenv').config();
const connectDB = require('./config/db');
async function start() {
  const { MONGODB_URI, GROQ_API_KEY, GROQ_MODEL, CLIENT_URL } = process.env;
  const port = process.env.PORT || '3000';
  if (!MONGODB_URI || !GROQ_API_KEY || !GROQ_MODEL || !CLIENT_URL || !/^\d+$/.test(port) || +port < 1 || +port > 65535) throw new Error('Set MONGODB_URI, GROQ_API_KEY, GROQ_MODEL, CLIENT_URL and a valid PORT');
  await connectDB(MONGODB_URI);
  require('./app').listen(+port, () => console.log(`Server listening on port ${port}`));
}
start().catch(err => { console.error('Startup failed:', err.message); process.exit(1); });
