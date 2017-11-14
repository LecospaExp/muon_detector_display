var socket = io('http://140.112.104.83:9487');

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

var ch2deg = [-90,-67.5,-45,-22.5,0,22.5,45,67.5,90];
var count = [1,15,40,70,82,70,40,15,1];
    
var ctx = document.getElementById("count-degree");
var result;
var fit_count=[0];

var count_channel = new Chart(ctx, {
	type: "bar",
    data: {
    	labels: ["-90","-67.5","-45","-22.5","0","22.5","45","67.5","90"],
    	datasets: [
			{
    			label: "Count",
    			type: "bar",
    			backgroundColor: "#3e95cd",
    			data: count
    		},{
    			label: "Fitting",
    			type: "line",
    			borderColor: "#8e5ea2",
    			xAxisID: 'x-axis-fitting',
    			data: fit_count,
    			// pointHoverRadius: 0,
    			fill: true
    		}
    	]
    },
    options: {
    	title: {
    		display: true,
    		text: "Count-Angle"
    	},
    	scales: {
    		xAxes: [{},{
    			ticks: {
	    			min: -90,
	    			max: 90,
	    			stepSize: 1,
    				beginAtZero: false
    			},
    			id: "x-axis-fitting",
    			type: "linear",
    			position: "bottom",
    			display: true
    		}]
    	},
    	responsive: false
	}
    
});

socket.on('hit', function(channel_number){
	console.log(channel_number);
	channel_count[channel_number-1] += 1;

	
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
	
    console.log(result.equation[0]);
    console.log(result.equation[1]);

    // y = [0]*x + []
    for(var i=-90; i<=90; i++)
    {
    	fit_count[i+90] = result.equation[1] + result.equation[0]*Math.pow(Math.cos(Math.radians(i)),2)
    }

    console.log(fit_count[32]);

	count_channel.update();
}
test()