const Conversation = require('./conversation.model');
exports.findById = id => Conversation.findById(id).lean();
exports.create = data => Conversation.create(data);
exports.append = (id, messages) => Conversation.findByIdAndUpdate(id, { $push: { messages: { $each: messages } } }, { new: true }).lean();
