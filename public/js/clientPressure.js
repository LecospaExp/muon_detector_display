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

var result; // Fitting function.
var fit_count = [];
var cptPlot = document.getElementById("pressure-time")
var cpPlot = document.getElementById("pressure-count")

var pressureTimePlot = new Chart(cptPlot, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Count',
      type: "line",
      yAxisID: 'count',
      borderColor: "#87b5ff",
      fill: false,
      data: []
    }, {
      label: 'Pressure',
      type: "line",
      yAxisID: 'pressure',
      borderColor: "#ffc268",
      fill: false,
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        id: 'count',
        type: 'linear',
        labelString:"Count/hour",
        position: 'left',
        scaleLabel:{
            display: true,
            labelString:"Count/hour",
        }
        
      }, {
        id: 'pressure',
        type: 'linear',
        
        position: 'right',
        scaleLabel:{
            display: true,
            labelString:"Pressure(hPa)",
        }
      }],
      xAxes: [{
                display: true,
                type:'time',
                time: {
                    unit: 'day',
                    unitStepSize: 1,
                    displayFormats: {
                       'day': 'MMM DD'
                    }
                },

            },{
                display: true,
                type:'time',
                time: {
                    unit: 'hour',
                    unitStepSize: 6,
                    displayFormats: {
                       'day': 'MMM DD'
                    }
                },
                scaleLabel:{
                    display: true,
                    labelString:"Local time",
                }


            }],
    }
  }
});

var pressureCountPlot = new Chart(cpPlot, {
  type: 'scatter',
  data: {
    datasets: [{
        label:"Count",
      yAxisID: 'count',
      fill: true,
      borderColor: "#ffc268",
      backgroundColor: "#ffc268",
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        id: 'count',
        type: 'linear',
        position: 'left',
        
        scaleLabel:{
            display: true,
            labelString:"Count/hour",
        }
      }],
      xAxes: [{
                display: true,
                label:"Pressure",
                type: 'linear',
                
                scaleLabel:{
                    display: true,
                    labelString:"Pressure(hPa)",
                }
            }],
    }
  }
});
socket.emit("getPressureTime");
socket.on("pressureTimeData", function(res){
    console.log("pressureTime data get");
    var ptData = [];
    var ctData = [];
    var cpData = [];
    var tLabel = [];
    for (var i = res.length - 1; i >= 0; i--) {
        ptData.push({t: new Date(res[i]._id*3600*1000), y:Math.myround(res[i].pressure, 3)})
        ctData.push({t: new Date(res[i]._id*3600*1000), y:res[i].count})
        cpData.push({x: Math.myround(res[i].pressure, 3), y:res[i].count})
    }
    pressureTimePlot.data.datasets[0].data = ctData;
    pressureTimePlot.data.datasets[1].data = ptData;
    pressureTimePlot.update();


    pressureCountPlot.data.datasets[0].data = cpData;
    pressureCountPlot.update();
})

function resizeHist(){
    pressureTimePlot.update();
}
