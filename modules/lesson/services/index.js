const repo = require('../repository');
const aiJson = require('../../../utils/ai-json');
const schemas = require('../../../utils/schemas');
const ApiError = require('../../../utils/api-error');
exports.generateLesson = async ({ topic, level }) => {
  const data = await aiJson('Create a technically accurate programming lesson tailored to the requested topic and level. Explain concepts in a logical progression, include concrete examples, identify common misconceptions where useful, and avoid presenting uncertain claims as facts. Return JSON with title, topic, level, description, learningObjectives (nonempty string array), sections (nonempty array of objects with title, explanation, example and nonempty keyPoints string array), whiteboard (nodes and edges arrays), recap (nonempty string array), and estimatedDuration (integer minutes). Provide 3 to 10 meaningful nodes forming a logical learning flow. Each node has unique id, type (concept, process, example or question), position {x,y} with finite numeric coordinates, and data {label,description}. Each edge has unique id, source, target and label and must refer to existing nodes. Place nodes at distinct, readable positions. Use concise descriptions and substantive explanations.', { topic, level }, schemas.lesson);
  data.topic = topic; data.level = level;
  // Keep the legacy fields used by the existing tutor and quiz services.
  data.summary = data.description;
  data.explanation = data.sections.map(section => `${section.title}: ${section.explanation}`).join('\n\n');
  data.diagram = { nodes: data.whiteboard.nodes.map(node => ({ id: node.id, label: node.data.label, description: node.data.description })), edges: data.whiteboard.edges };
  return repo.createLesson(data);
};
exports.getLessonById = async id => { const lesson = await repo.findLessonById(id); if (!lesson) throw new ApiError(404, 'Lesson not found'); return lesson; };
