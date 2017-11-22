var time = require('time');
module.exports = function (io, database) {
	io.sockets.on('connection', function (client) {
		console.log('[socket]connect:'+client.id);
		if(!client.handshake.session.startEvtTime){
			client.handshake.session.startEvtTime = time.time()
			console.log('[socket]startTime:'+client.handshake.session.startEvtTime)
		}else{

			getEvtFromTime(client.handshake.session.startEvtTime, function(res){
				var totalCount = [0,0,0,0,0,0,0,0,0]
				for (var i = 0; i < res.length; i++) {
					if(res[i]._id>=1&&res[i]._id<=9){
						totalCount[res[i]._id] = res[i].sum
					}
				}
				socket.emit('CurCount', totalCount);
				console.log(totalCount)
			})
		}
		socket.emit('strTime', client.handshake.session.startEvtTime);
	});

	return {
		'hitEvent':function(channel){
			io.sockets.emit('hit', channel)
		},
		'pressureEvent':function(value){
			io.sockets.emit('pressure', value)
		}
	}
}