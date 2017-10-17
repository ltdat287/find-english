// Load mongoose since we need it to define a model
const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	fb_id: { type: String, required: true },
	first_name: String,
	last_name: String,
	profile_pic: String,
	gender: String,
	locale: String,
	timezone: String
});
