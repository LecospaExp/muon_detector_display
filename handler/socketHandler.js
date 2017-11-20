module.exports = function (io, database) {
	// Web Socket Connection
	io.sockets.on('connection', function (client) {
		console.log('[socket]connect:'+client.id);
		// if(!socket.handshake.session.countCH){
		// 	socket.handshake.session.countCH = [0,0,0,0,0,0,0,0,0];
		// 	socket.handshake.session.save();	
		// }else{
		// 	io.sockets.emit('curCount', socket.handshake.session.countCH)
		// }
	});
	return {
		'hitEvent':function(channel){
			io.sockets.emit('hit', channel)
			socket.handshake.session.countCH[channel-1]+=1
			socket.handshake.session.save();
		},
		'pressureEvent':function(value){
			io.sockets.emit('pressure', value)
		}
	}
}