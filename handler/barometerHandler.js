var rpiSensors = require('raspi-sensors');
module.exports = function(socket, config) {
	var BMP180 = new rpiSensors.Sensor({
		type    : "BMP180",
		address : 0X77
	}, "barometer");
	var curPressure = 0;
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
			addNewEvent(1, curPressure, 1510682601);
		}
	}, 10); // Fetch data every 5 seconds 
	return {
		getCurrentPressure: function(){return curPressure;}
	}
}