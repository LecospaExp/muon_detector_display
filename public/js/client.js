var socket = io('http://localhost:5000');

socket.on('example-pong', function (data) {
    console.log("pong");
});

socket.on('hit', function(data){
	console.log(data);
})
