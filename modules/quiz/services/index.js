const repo = require('../repository');
const lessons = require('../../lesson/repository');
const aiJson = require('../../../utils/ai-json');
const schemas = require('../../../utils/schemas');
const ApiError = require('../../../utils/api-error');
exports.generateQuiz = async ({ lessonId, count }) => {
  const lesson = await lessons.findLessonById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  const generated = await aiJson('Create a technically accurate multiple-choice quiz based on the supplied lesson. Return JSON {questions:[{questionId,question,options,correctOptionIndex,explanation}]}. Use exactly the requested count, unique question IDs, exactly four options, a zero-based correctOptionIndex, and a short explanation for each answer.', { lesson: { topic: lesson.topic, summary: lesson.summary, explanation: lesson.explanation, sections: lesson.sections }, count }, schemas.quiz.refine(q => q.questions.length === count, 'Wrong question count'));
  const saved = await repo.create({ lessonId, questions: generated.questions });
  return { quizId: saved._id, questions: generated.questions.map(({ questionId, question, options }) => ({ questionId, question, options })) };
};
exports.submitQuiz = async ({ quizId, answers }) => {
  const quiz = await repo.findById(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  const ids = new Set(quiz.questions.map(q => q.questionId));
  if (new Set(answers.map(a => a.questionId)).size !== answers.length || answers.some(a => !ids.has(a.questionId))) throw new ApiError(400, 'Duplicate or unknown question ID');
  const selected = new Map(answers.map(a => [a.questionId, a.selectedOptionIndex]));
  const results = quiz.questions.map(q => { const selectedOptionIndex = selected.has(q.questionId) ? selected.get(q.questionId) : null; return { questionId: q.questionId, selectedOptionIndex, correctOptionIndex: q.correctOptionIndex, correct: selectedOptionIndex === q.correctOptionIndex, explanation: q.explanation }; });
  const score = results.filter(r => r.correct).length;
  return { score, totalQuestions: results.length, percentage: Math.round(score / results.length * 100), results };
};
