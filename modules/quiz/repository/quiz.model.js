const mongoose = require('mongoose');
const schema = new mongoose.Schema({ lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }, questions: [{ _id: false, questionId: String, question: String, options: [String], correctOptionIndex: Number, explanation: String }] }, { timestamps: true });
module.exports = mongoose.model('Quiz', schema);
