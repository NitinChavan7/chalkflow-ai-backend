const service = require('../services');
exports.askTutorController = async (req,res) => res.json({ success: true, message: 'Tutor response generated', data: await service.askTutor(req.body) });
