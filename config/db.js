const mongoose = require('mongoose');
let pendingConnection;
async function connectDB(uri = process.env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  if (!pendingConnection) {
    pendingConnection = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then(() => mongoose.connection)
      .finally(() => { pendingConnection = undefined; });
  }
  return pendingConnection;
}
module.exports = connectDB;
