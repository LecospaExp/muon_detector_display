var socket = io('http://192.168.0.118:5000');

socket.on('example-pong', function (data) {
    console.log("pong");
});

socket.on('hit', function(data){
	console.log(data);
})
