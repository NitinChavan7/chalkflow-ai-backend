const Quiz = require('./quiz.model');
exports.create = data => Quiz.create(data);
exports.findById = id => Quiz.findById(id).lean();
