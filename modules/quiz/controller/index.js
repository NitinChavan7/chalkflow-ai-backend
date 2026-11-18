const service = require('../services');
exports.generate = async (req,res) => res.status(201).json({ success: true, message: 'Quiz generated successfully', data: await service.generateQuiz(req.body) });
exports.submit = async (req,res) => res.json({ success: true, message: 'Quiz evaluated successfully', data: await service.submitQuiz(req.body) });
