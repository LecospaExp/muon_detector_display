module.exports = function (io) {
	// Web Socket Connection
	io.sockets.on('connection', function (client) {
		console.log('[socket]connect:'+client.id);
	});
}