var rpiSensors = require('raspi-sensors');
module.exports = function(socket, config) {
	var BMP180 = new rpiSensors.Sensor({
		type    : "BMP180",
		address : 0X77
	}, "barometer");
	var curPressure = 0;
	var Pa2Atm = function(pascal){
		return 0.00000986923267*pascal
	}
	BMP180.fetch(function(err, data) {
		if(err) {
			console.error("An error occured!");
			console.error(err.cause);
			return;
		}
		if(data.type=='Pressure'){
			curPressure = Math.round(Pa2Atm(data.value), 7)
			socket.pressureEvent(curPressure);
			console.log(curPressure);
		}

		// Log the values 
		console.log(data);
	});
	BMP180.fetchInterval(function(err, data) {
		if(err) {
		    console.error("[Barometer]");
		    console.error(err.cause);
		    return;
		}
		if(data.type=='Pressure'){
			curPressure = Math.round((Pa2Atm(data.value)+curPressure*(config.smoothFactor-1))/config.smoothFactor,7)
			socket.pressureEvent(curPressure);
			console.log(curPressure);
		}
	}, 5); // Fetch data every 5 seconds 
}