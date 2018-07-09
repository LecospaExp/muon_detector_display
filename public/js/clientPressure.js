//var socket = io('http://192.168.8.104:9487');
var socket = io('http://140.112.104.115:5001');

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
Math.myround = function(x, n){
    return Math.round(x*Math.pow(10, n))/Math.pow(10, n)
}
var ch2deg = [-80,-60,-40,-20,0,20,40,60,80];

var strTime = Math.round(Date.now()/1000)
var count = [0,0,0,0,0,0,0,0,0];
var totalHit = 0;
var ch_max = count.reduce(function(a,b){
    return Math.max(a,b);
});

var result; // Fitting function.
var fit_count = [];


var count_angle = new Chart(ctx, {
	type: "line",
    data: {},
    options: {
    	responsive: true
    }
    
});
socket.emit("getPressureTime");
socket.on("pressureTimeData", function(res){
    console.log(res);
})

function timer(){
    $('#totalTime').html(Math.round(Date.now()/1000) - strTime); 
    $('#hitRate').html(Math.myround(totalHit/(Date.now()/1000 - strTime), 3))
    setTimeout(timer, 1000)
}

function resizeHist(){
    count_angle.update();
}