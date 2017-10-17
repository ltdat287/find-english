// Load mongoose since we need it to define a model
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

module.exports = mongoose.model('Message', {
	user_id: { type: Schema.Types.ObjectId, ref: 'users',required: [true,'No user id found'] },
	question: String,
	answer: String,
	time_created: Date
});
