var serialport  = require("serialport");
module.exports = function(io){
	var sp = new serialport('/dev/ttyAMA0', {
		baudRate: 115200,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false
	});
	sp.on('data', function (data) {
		data = data.toString().split("");
		for (var i = 0; i < data.length; i++) {
			io.sockets.emit('hit', data[i]);
			console.log(data[i]);
		}
	});
	sp.on('error', function(e){
	  	console.error(e);
	})

}

	