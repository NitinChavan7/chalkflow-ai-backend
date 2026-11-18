const { rateLimit } = require('express-rate-limit');
module.exports = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, handler: (req,res) => res.status(429).json({ success: false, message: 'Too many AI requests, please try again later' }) });
