var mongojs = require('mongojs');
var Event = require('./event.js');
module.exports = function(app, db){

	return {
		'addNewEvent':function(Channel, Pressure, hitTime){
			db.events.insert({time: hitTime, channel: Channel, pressure: Pressure}, function(err, res){
				if(err){
					console.error('[DB]'+err);
				}
				// console.log("channel:"+Channel+" Pressure:"+Pressure+" time:"+hitTime);
			})
		}, 
		'getLastEvtTime':function(){
			var result = db.events.findOne({$query:{},$orderby:{_id:-1}})	
			if(result){
				return result.time
			}else{
				return null
			}
		},
		'getEvtFromTime':function(strTime, callback){
			console.log(strTime)
			db.events.aggregate({
					$match:{"time":{$gt:strTime}}
				},{
					$group:{
						_id:"$channel",
						sum:{$sum:1}
					}
				},{
					$sort:{"_id":1}
				}, function(err, res){
					if(err){
						console.log(err)
					}else{
						callback(res)
					}
			})
		},
		'getEvtFromBeginning':function(callback){
			db.events.aggregate({
					$match:{}
				},{
					$group:{
						_id:"$channel",
						sum:{$sum:1}
					}
				},{
					$sort:{"_id":1}
				}, function(err, res){
					if(err){
						console.log(err)
					}else{
						callback(res)
					}
			})
		},
		'getFirstEvt':function(callback){
			db.events.findOne({},function(err, res){
					if(err){
						console.log(err)
					}else{
						callback(res)
					}
			})
		}
	}
}
