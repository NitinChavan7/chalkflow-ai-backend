const router = require('express').Router();
const { z } = require('zod');
const { validate, objectId, text } = require('../../utils/validate');
const asyncHandler = require('../../utils/async-handler');
const controller = require('./controller');
const database = require('../../middleware/database.middleware');
router.post('/generate', require('../../middleware/rate-limit.middleware'), validate(z.object({ lessonId: objectId, count: z.number().int().min(1).max(10).default(5) }).strict()), database, asyncHandler(controller.generate));
router.post('/submit', validate(z.object({ quizId: objectId, answers: z.array(z.object({ questionId: text(100), selectedOptionIndex: z.number().int().min(0).max(3) }).strict()).max(10) }).strict()), database, asyncHandler(controller.submit));
module.exports = router;
