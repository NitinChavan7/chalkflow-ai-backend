const router = require('express').Router();
const { z } = require('zod');
const { validate, objectId, text } = require('../../utils/validate');
const ApiError = require('../../utils/api-error');
const asyncHandler = require('../../utils/async-handler');
const controller = require('./controller');
router.post('/generate', require('../../middleware/rate-limit.middleware'), validate(z.object({ topic: text(200), level: z.enum(['beginner','intermediate','advanced']) }).strict()), asyncHandler(controller.generateLessonController));
router.get('/:id', (req,res,next) => objectId.safeParse(req.params.id).success ? next() : next(new ApiError(400, 'Invalid lesson ID')), asyncHandler(controller.getLessonController));
module.exports = router;
