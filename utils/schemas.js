const { z } = require('zod');
const { text } = require('./validate');
const node = z.object({ id: text(100), label: text(200), description: text(2000) }).strict();
const edge = z.object({ id: text(100), source: text(100), target: text(100), label: z.string().max(200) }).strict();
const diagram = z.object({ nodes: z.array(node).min(3).max(10), edges: z.array(edge).max(30) }).strict();
function graphValid(nodes, edges) { const ids = nodes.map(n => n.id); const edgeIds = edges.map(e => e.id); return new Set(ids).size === ids.length && new Set(edgeIds).size === edgeIds.length && edges.every(e => ids.includes(e.source) && ids.includes(e.target)); }
const flowNode = z.object({ id: text(100), type: z.enum(['concept', 'process', 'example', 'question']), position: z.object({ x: z.number().finite().min(-100000).max(100000), y: z.number().finite().min(-100000).max(100000) }).strict(), data: z.object({ label: text(200), description: text(500) }).strict() }).strict();
const whiteboard = z.object({ nodes: z.array(flowNode).min(3).max(10), edges: z.array(edge).min(1).max(30) }).strict().refine(d => graphValid(d.nodes, d.edges), 'Invalid whiteboard references or duplicate IDs');
const lesson = z.object({ title: text(200), topic: text(200), level: z.enum(['beginner', 'intermediate', 'advanced']), description: text(3000), learningObjectives: z.array(text(500)).min(1).max(10), sections: z.array(z.object({ title: text(200), explanation: text(5000), example: text(5000), keyPoints: z.array(text(500)).min(1).max(10) }).strict()).min(1).max(10), whiteboard, recap: z.array(text(500)).min(1).max(10), estimatedDuration: z.number().int().min(1).max(300) }).strict();
const board = z.object({ action: z.enum(['none','add','replace']), nodes: z.array(node).max(10), edges: z.array(edge).max(30) }).strict();
const tutor = z.object({ answer: text(12000), highlightNodeId: z.string().max(100).nullable(), boardUpdate: board.nullable() }).strict();
const quiz = z.object({ questions: z.array(z.object({ questionId: text(100), question: text(2000), options: z.array(text(1000)).length(4), correctOptionIndex: z.number().int().min(0).max(3), explanation: text(2000) }).strict()).min(1).max(10) }).strict().refine(q => new Set(q.questions.map(x => x.questionId)).size === q.questions.length, 'Duplicate question IDs');
module.exports = { lesson, tutor, quiz, graphValid };
