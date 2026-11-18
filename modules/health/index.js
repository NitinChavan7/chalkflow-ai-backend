const router = require('express').Router();
router.get('/', (req,res) => res.json({ success: true, message: 'Service is running', data: { status: 'ok' } }));
module.exports = router;
