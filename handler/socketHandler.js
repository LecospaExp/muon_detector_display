var time = require('time');
module.exports = function (io, database) {
	// Web Socket Connection
	// io.sockets.on('connection', function (client) {
	// 	console.log('[socket]connect:'+client.id);
	// 	// if(!socket.handshake.session.countCH){
	// 	// 	socket.handshake.session.countCH = [0,0,0,0,0,0,0,0,0];
	// 	// 	socket.handshake.session.save();	
	// 	// }else{
	// 	// 	io.sockets.emit('curCount', socket.handshake.session.countCH)
	// 	// }
	// });
	io.sockets.on('connection', function (client) {
		console.log('[socket]connect:'+client.id);
		if(!client.handshake.session.startEvtTime){
			client.handshake.session.startEvtTime = time.time()
			console.log('[bgCounter]startTime:'+client.handshake.session.startEvtTime)
		}else{
			getEvtFromTime(client.handshake.session.startEvtTime, function(res){
				var totalCount = [0,0,0,0,0,0,0,0,0]
				for (var i = 0; i < res.length; i++) {
					if(res[i]._id>=1&&res[i]._id<=9){
						totalCount[res[i]._id] = res[i].sum
					}
				}
				socket.emit('totalCount', totalCount);
				console.log(totalCount)
			})
		}
	});
	// var bgCounter = io.of('/bgCounter')
	// 				.on('connection',function(socket){
	// 					if(!socket.handshake.session.startEvtTime){
	// 						socket.handshake.session.startEvtTime = time.time()
	// 						console.log('[bgCounter]startTime:'+socket.handshake.session.startEvtTime)
	// 					}else{
	// 						getEvtFromTime(socket.handshake.session.startEvtTime, function(res){
	// 							var totalCount = [0,0,0,0,0,0,0,0,0]
	// 							for (var i = 0; i < res.length; i++) {
	// 								if(res[i]._id>=1&&res[i]._id<=9){
	// 									totalCount[res[i]._id] = res[i].sum
	// 								}
	// 							}
	// 							socket.emit('totalCount', totalCount);
	// 							console.log(totalCount)
	// 						})
	// 					}
	// 					console.log('[bgCounter]connect:'+socket.id);

	// 				})

	return {
		'hitEvent':function(channel){
			io.sockets.emit('hit', channel)
		},
		'pressureEvent':function(value){
			io.sockets.emit('pressure', value)
		}
	}
}