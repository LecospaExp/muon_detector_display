var rpiSensors = require('raspi-sensors');
module.exports = function(socket) {
	var BMP180 = new rpiSensors.Sensor({
		type    : "BMP180",
		address : 0X70
	}, "light_sensor");
	BMP180.fetch(function(err, data) {
		if(err) {
			console.error("An error occured!");
			console.error(err.cause);
			return;
		}

		// Log the values 
		console.log(data);
	});
	BMP180.fetchInterval(function(err, data) {
		if(err) {
		    console.error("An error occured!");
		    console.error(err.cause);
		    return;
		}
		socket.pressureEvent(data);

		// Log the values 
		console.log(data);
	}, 5); // Fetch data every 5 seconds 
}