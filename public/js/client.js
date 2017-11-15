var socket = io('http://140.112.104.83:9487');

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

var ch2deg = [-90,-67.5,-45,-22.5,0,22.5,45,67.5,90];
var count = [10,150,400,700,820,700,400,150,10];
    
var ctx = document.getElementById("count-degree");
var button = document.getElementById("reset");
var result; // Fitting function.
var fit_count = [];

var count_angle = new Chart(ctx, {
	type: "bar",
    data: {
    	labels: ["-90","-67.5","-45","-22.5","0","22.5","45","67.5","90"],
    	datasets: [
    		{
    			label: "Fitting",
    			type: "line",
    			borderColor: "#8e5ea2",
    			xAxisID: 'x-axis-fitting',
    			data: fit_count,
    			fill: false
    		}, {
    			label: "Count",
    			type: "bar",
    			backgroundColor: "#3e95cd",
    			data: count
    		}
    	]
    },
    options: {
    	title: {
    		display: true,
    		text: "Count-Angle",
    		fontSize: 50
    	},
    	scales: {
    		xAxes: [{
    			scaleLabel:{
	    			display: true,
	    			labelString: "Degree",
	    			fontSize: 30
    			},
    			ticks:{
    				fontSize: 20
    			}
    		},{
    			id: "x-axis-fitting",
    			type: "linear",
    			position: "bottom",
    			display: false
    		}],
    		yAxes: [{
    			scaleLabel:{
    				display: true,
    				labelString: "Count",
    				fontSize: 30
    			},
    			ticks:{
    				fontSize: 20,
    				min: 0
    			}
    		}]
    	},
    	elements:{
    		point:{
    			radius: 0
    		}
    	},
    	responsive: false
	}
    
});

socket.on('hit', function(channel_number){
	console.log(channel_number);
	count[channel_number-1] += 1;

});

function test(){
	result = regression.linear([ [Math.pow(Math.cos(Math.radians(ch2deg[0])),2), count[0]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[1])),2), count[1]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[2])),2), count[2]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[3])),2), count[3]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[4])),2), count[4]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[5])),2), count[5]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[6])),2), count[6]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[7])),2), count[7]],
								 [Math.pow(Math.cos(Math.radians(ch2deg[8])),2), count[8]],
							   ]);
	
    // console.log(result.equation[0]);
    // console.log(result.equation[1]);

    // y = [0]*x + [1]
    for(var i=-90; i<=90; i++)
    {
    	fit_count[i+90] = {
    		x: i,
    		y: result.equation[1] + result.equation[0]*Math.pow(Math.cos(Math.radians(i)),2)
    	};
    }

	count_angle.update();
}

test();

function reset() {
	count = [0,0,0,0,0,0,0,0,0];
	count_angle.data.datasets[1].data = count;
	test();
}

button.onclick = function() {reset()};

socket.on('pressure', function(value){
	console.log("pressure: "+value);
});
