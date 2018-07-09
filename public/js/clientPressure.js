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
var totalHit = 0;
var ch_max = count.reduce(function(a,b){
    return Math.max(a,b);
});

var result; // Fitting function.
var fit_count = [];
var ctx = document.getElementById("pressure-time")

var pressureTimePlot = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Count',
      type: "line",
      yAxisID: 'count',
      data: [{0, 0}]
    }, {
      label: 'Pressure',
      type: "line",
      yAxisID: 'pressure',
      data: [{0, 0}]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        id: 'count',
        type: 'linear',
        position: 'left',
      }, {
        id: 'pressure',
        type: 'linear',
        position: 'right',
      }]
    }
  }
});
socket.emit("getPressureTime");
socket.on("pressureTimeData", function(res){
    console.log("pressureTime data get");
    var ptData = [];
    for (var i = res.length - 1; i >= 0; i--) {
        ptData.push({t: new Date(res[i]._id*3600), myround(res[i].pressure, 4)})
        ctData.push({t: new Date(res[i]._id*3600), res[i].count})
    }
    pressureTimePlot.data.datasets[0].data = ctData;
    pressureTimePlot.data.datasets[1].data = ptData;
    pressureTimePlot.update();

})

function timer(){
    $('#totalTime').html(Math.round(Date.now()/1000) - strTime); 
    $('#hitRate').html(Math.myround(totalHit/(Date.now()/1000 - strTime), 3))
    setTimeout(timer, 1000)
}

function resizeHist(){
    pressureTimePlot.update();
}
