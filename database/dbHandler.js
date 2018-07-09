var mongojs = require('mongojs');
var Event = require('./event.js');
module.exports = function(app, db){

	return {
		'addNewEvent':function(Channel, Pressure, hitTime, temp){
			db.events.insert({time: hitTime, channel: Channel, pressure: Pressure, temperature: temp}, function(err, res){
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
		},
		'getGroupedDataInHours':function(callback){
			db.events.aggregate([
				{$project:{
					channel:1, 
					pressure:1, 
					time:{
						$divide:[{
							$subtract:["$time",{$mod:["$time", 3600]}]}, 3600]
						}
					}
				},{$group:{
					_id: "$time", 
					pressure:{$avg:"$pressure"}, 
					temp:{$avg:"$temperature"}, 
					count:{$sum:1}}
				} , {$sort:
					{_id:-1}
				}],function(err, res){
					if(err){
						console.log(err)
					}else{
						callback(res)
					}
			})
		}
	}
}
