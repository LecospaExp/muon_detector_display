var serialport  = require("serialport").SerialPort;
module.exports = function(socket, database, config, baro){
	var sp = new serialport(config.port, {
		baudRate: 115200,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false
	}, function(err){
		console.log('hello')
	});
	sp.on('data', function (data) {
		data = data.toString().split("");
		for (var i = 0; i < data.length; i++) {
			socket.hitEvent(data[i]);
			console.log(data[i]);
		}
	});
	sp.on('error', function(e){
	  	console.error(e);
	})

}

	
