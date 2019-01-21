const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const locationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String, required: true},
	latitude: {type: Number, required: true},
	longitude: {type: Number, required: true},
	url: {type: String, required: true}
});

module.exports = mongoose.model('Location', locationSchema)