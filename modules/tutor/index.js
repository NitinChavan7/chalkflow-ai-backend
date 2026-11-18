const router = require('express').Router();
const { z } = require('zod');
const { validate, objectId, text } = require('../../utils/validate');
router.post('/ask', require('../../middleware/rate-limit.middleware'), validate(z.object({ lessonId: objectId, question: text(2000), conversationId: objectId.nullable().optional() }).strict()), require('../../utils/async-handler')(require('./controller').askTutorController));
module.exports = router;
