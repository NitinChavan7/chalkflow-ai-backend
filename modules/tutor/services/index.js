const repo = require('../repository');
const lessons = require('../../lesson/repository');
const aiJson = require('../../../utils/ai-json');
const { tutor, graphValid } = require('../../../utils/schemas');
const ApiError = require('../../../utils/api-error');
const { z } = require('zod');
exports.askTutor = async ({ lessonId, question, conversationId }) => {
  const lesson = await lessons.findLessonById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  let conversation = conversationId ? await repo.findById(conversationId) : null;
  if (conversationId && !conversation) throw new ApiError(404, 'Conversation not found');
  if (conversation && String(conversation.lessonId) !== lessonId) throw new ApiError(400, 'Conversation does not belong to lesson');
  const context = { title: lesson.title, topic: lesson.topic, summary: lesson.summary, explanation: lesson.explanation, diagram: lesson.diagram };
  const schema = tutor.superRefine((value, ctx) => {
    const update = value.boardUpdate; const base = lesson.diagram;
    const nodes = !update || update.action === 'none' ? base.nodes : update.action === 'add' ? [...base.nodes, ...update.nodes] : update.nodes;
    const edges = !update || update.action === 'none' ? base.edges : update.action === 'add' ? [...base.edges, ...update.edges] : update.edges;
    if ((update?.action === 'none' && (update.nodes.length || update.edges.length)) || !graphValid(nodes, edges) || (value.highlightNodeId && !nodes.some(n => n.id === value.highlightNodeId))) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid board update' });
  });
  const result = await aiJson('You are a programming tutor for learners. Answer only questions relevant to the lesson; politely redirect unrelated questions. Explain in clear steps appropriate to the learner, use a concrete example when helpful, and address misconceptions without being condescending. If uncertain or the question lacks enough information, say so rather than inventing facts and suggest a useful next step. Return JSON with answer, highlightNodeId (existing or resulting node ID, or null), boardUpdate (null or {action: none, add, or replace, nodes: array, edges: array}). Nodes contain id, label, description; edges contain id, source, target, label. For none use empty arrays. Add extends the original diagram; replace supplies a complete valid diagram. Use unique IDs and valid references. No node positions.', { lesson: context, history: (conversation?.messages || []).slice(-10).map(({role,content}) => ({role,content})), question }, schema);
  const messages = [{ role: 'user', content: question }, { role: 'assistant', content: result.answer }];
  if (conversation) conversation = await repo.append(conversation._id, messages); else conversation = await repo.create({ lessonId, messages });
  if (!conversation) throw new ApiError(404, 'Conversation not found');
  return { ...result, conversationId: conversation._id };
};
