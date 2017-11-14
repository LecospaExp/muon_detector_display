module.exports = function (io, database) {
	// Web Socket Connection
	io.sockets.on('connection', function (client) {
		console.log('[socket]connect:'+client.id);
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