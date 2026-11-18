const connectDB = require('../config/db');
const ApiError = require('../utils/api-error');
module.exports = async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (error) {
    console.error('MongoDB connection failed', { name: error.name, code: typeof error.code === 'number' ? error.code : undefined, configured: Boolean(process.env.MONGODB_URI) });
    next(new ApiError(503, 'Database service unavailable'));
  }
};
