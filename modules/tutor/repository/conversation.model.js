const mongoose = require('mongoose');
const schema = new mongoose.Schema({ lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true }, messages: [{ role: { type: String, enum: ['user','assistant'], required: true }, content: { type: String, required: true }, createdAt: { type: Date, default: Date.now } }] }, { timestamps: true });
module.exports = mongoose.model('Conversation', schema);
