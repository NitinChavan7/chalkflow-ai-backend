const service = require('../services');
exports.generateLessonController = async (req,res) => res.status(201).json({ success: true, message: 'Lesson generated successfully', data: { lesson: await service.generateLesson(req.body) } });
exports.getLessonController = async (req,res) => res.json({ success: true, message: 'Lesson retrieved successfully', data: { lesson: await service.getLessonById(req.params.id) } });
