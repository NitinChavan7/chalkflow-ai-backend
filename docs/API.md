# API reference

All endpoints are under `/api`. IDs are MongoDB ObjectId strings. Errors have the form `{ "success": false, "message": "..." }`; invalid inputs return 400, missing records 404, rate limits 429, upstream AI failures 502 or 503, and unexpected errors 500.

## GET /api/health

No body. Response 200: `{ "success": true, "message": "Service is running", "data": { "status": "ok" } }`.

## POST /api/lessons/generate

Body: `{ "topic": "JavaScript Event Loop", "level": "beginner" }`. Level is `beginner`, `intermediate`, or `advanced`. Response 201 contains `success`, `message` and `data.lesson`. The saved lesson includes `_id`, `title`, `topic`, `level`, `description`, `learningObjectives`, `sections`, `whiteboard`, `recap`, `estimatedDuration` and timestamps. Each section has `title`, `explanation`, `example` and `keyPoints`. The whiteboard contains 3–10 nodes with `id`, `type`, `position: { x, y }` and `data: { label, description }`, plus edges with `id`, `source`, `target`, and `label`. Types are `concept`, `process`, `example`, or `question`. The legacy `summary`, `explanation` and `diagram` fields are retained for existing consumers.

## GET /api/lessons/:id

No body. Response 200: `{ "success": true, "message": "Lesson retrieved successfully", "data": { "lesson": { "_id": "..." } } }`, with the complete lesson.

## POST /api/tutor/ask

Body: `{ "lessonId": "...", "question": "What is the call stack?", "conversationId": null }`. `conversationId` is optional. Response 200: `{ "success": true, "message": "Tutor response generated", "data": { "answer": "...", "highlightNodeId": null, "boardUpdate": null, "conversationId": "..." } }`. A board update, when present, has `action` (`none`, `add`, or `replace`), `nodes`, and `edges`. The conversation must belong to the lesson.

## POST /api/quiz/generate

Body: `{ "lessonId": "...", "count": 5 }`; count defaults to 5 and ranges from 1 to 10. Response 201: `{ "success": true, "message": "Quiz generated successfully", "data": { "quizId": "...", "questions": [{ "questionId": "q1", "question": "...", "options": ["A", "B", "C", "D"] }] } }`. Correct answers remain on the server until submission.

## POST /api/quiz/submit

Body: `{ "quizId": "...", "answers": [{ "questionId": "q1", "selectedOptionIndex": 1 }] }`. Indexes are zero-based. Missing answers are marked incorrect; duplicate and unknown IDs are rejected. Response 200: `{ "success": true, "message": "Quiz evaluated successfully", "data": { "score": 1, "totalQuestions": 1, "percentage": 100, "results": [{ "questionId": "q1", "selectedOptionIndex": 1, "correctOptionIndex": 1, "correct": true, "explanation": "..." }] } }`.
