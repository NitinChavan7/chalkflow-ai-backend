const router = require('express').Router();
router.use('/lessons', require('./lesson'));
router.use('/tutor', require('./tutor'));
router.use('/quiz', require('./quiz'));
router.use('/health', require('./health'));
module.exports = router;
