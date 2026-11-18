const { z } = require('zod');
const ApiError = require('./api-error');
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
const text = (max) => z.string().trim().min(1).max(max);
function validate(schema) { return (req, res, next) => { const result = schema.safeParse(req.body); if (!result.success) return next(new ApiError(400, result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '))); req.body = result.data; next(); }; }
module.exports = { validate, objectId, text };
