var mongojs = require('mongojs');
var Event = require('./event.js');

module.exports = function(app, db){

	return {
		addNewEvent:function(Channel, Pressure, Time, callback){
			db.events.insert({time: Time, channel: Channel, pressure: Pressure}, function(err, res){
				if(err){
					console.error('[DB]'+err);
				}
				console.log("channel:"+Channel+" Pressure:"+Pressure+" time:"+time);
			})
		}
	}
}