var socket = io('http://140.112.104.83:9487');

var channel_count = [0,0,0,0,0,0,0,0,0];

socket.on('hit', function(channel_number){
	console.log("hit: "+channel_number);
	channel_count[channel_number-1] += 1;
});
socket.on('pressure', function(value){
	console.log("pressure: "+value);
});
