const mongoose = require('mongoose');
const node = new mongoose.Schema({ id: String, label: String, description: String }, { _id: false });
const edge = new mongoose.Schema({ id: String, source: String, target: String, label: String }, { _id: false });
const flowNode = new mongoose.Schema({ id: String, type: { type: String, enum: ['concept', 'process', 'example', 'question'] }, position: { x: Number, y: Number }, data: { label: String, description: String } }, { _id: false });
const schema = new mongoose.Schema({ title: String, topic: { type: String, required: true }, level: String, description: String, summary: String, learningObjectives: [String], explanation: String, sections: [{ _id: false, title: String, explanation: String, example: String, keyPoints: [String], heading: String, content: String }], example: { title: String, code: String, walkthrough: [String] }, diagram: { nodes: [node], edges: [edge] }, whiteboard: { nodes: [flowNode], edges: [edge] }, recap: [String], estimatedDuration: Number }, { timestamps: true });
module.exports = mongoose.model('Lesson', schema);
