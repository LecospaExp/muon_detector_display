var mongoose = require('mongoose')

var evtSchema = mongoose.Schema({
	time: Date,
	channel: Number,
	pressure: Number
}, {collection:'events'})

module.exports = mongoose.model('Event', evtSchema)