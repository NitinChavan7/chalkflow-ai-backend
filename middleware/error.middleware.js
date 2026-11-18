const { ZodError } = require('zod');
module.exports = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message;
  if (err instanceof ZodError || err.name === 'ValidationError' || err.name === 'CastError') { status = 400; message = 'Invalid request data'; }
  if (err.code === 11000) { status = 409; message = 'Duplicate record'; }
  if (status >= 500) { console.error('Request failed', { method: req.method, path: req.path, status, name: err.name, code: typeof err.code === 'number' ? err.code : undefined }); if (status === 500) message = 'Internal server error'; }
  res.status(status).json({ success: false, message });
};
