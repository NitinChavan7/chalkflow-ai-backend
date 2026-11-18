const Lesson = require('./lesson.model');
exports.createLesson = data => Lesson.create(data);
exports.findLessonById = id => Lesson.findById(id).lean();
exports.findLessons = () => Lesson.find().lean();
