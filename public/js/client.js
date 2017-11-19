var socket = io('http://140.112.104.83:9487');

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

var ch2deg = [-80,-60,-40,-20,0,20,40,60,80];

var count = [0,0,0,0,0,0,0,0,0];
    
var ctx = document.getElementById("count-degree");
var button = document.getElementById("reset");
var result; // Fitting function.
var fit_count = [];

var canvas = document.getElementById('hit-pattern');

var count_angle = new Chart(ctx, {
	type: "bar",
    data: {
    	labels: ["-80","-60","-40","-20","0","20","40","60","80"],
    	datasets: [
    		{
    			label: "cos² fitting",
    			type: "line",
    			xAxisID: 'x-axis-fitting',
    			data: fit_count,
    			borderColor: "#E98B2A",
    			fontColor: "#000000",
    			fill: false
    		}, {
    			label: "Count",
    			type: "bar",
    			backgroundColor: "#F7D94C",
    			data: count
    		}
    	]
    },
    options: {
    	// title: {
    	// 	display: true,
    	// 	text: "Count-Angle",
    	// 	fontSize: 50
    	// },
    	scales: {
    		xAxes: [{
    			scaleLabel:{
	    			display: true,
	    			labelString: "Degree",
	    			fontColor: 	"#000000",
	    			fontSize: 20,
	    			position: "right"
    			},
    			ticks:{
    				fontColor: "#000000",
    				fontSize: 20
    			},
    			gridLines:{
    				display: false,
    				color: "#000000"
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
    				fontColor: 	"#000000",
    				fontSize: 20
    			},
    			ticks:{
    				fontColor: "#000000",
    				fontSize: 20,
    				min: 0
    			},
    			gridLines:{
    				display: true,
    				color: "#000000"
    			}
    		}]
    	},
    	elements:{
    		point:{
    			radius: 0
    		}
    	},
    	legend:{
    		labels:{
    			fontColor: "#000000",
    			fontSize: 14
    		}
    	},
    	responsive: false
	}
    
});

socket.on('hit', function(channel_number){
	console.log(channel_number);
	count[channel_number-1] += 1;
    count_angle.data.datasets[1].data = count;
    fitting()
    DrawHitPattern(channel_number)
});

function fitting(){
	
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


function reset() {
	count = [0,0,0,0,0,0,0,0,0];
	count_angle.data.datasets[1].data = count;
	test();

}

// button.onclick = function() {reset()};

socket.on('pressure', function(value){
	console.log("pressure: "+value);
});


function DrawHitPattern(){
    
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = 450;
        ctx.canvas.height = 250;
        ctx.translate(225, 220)
        for (var i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.lineTo(150,0);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeRect(150, -25, 50, 55);
            ctx.rotate(-Math.PI*22.5/180);
        }    
        ctx.beginPath();
        ctx.arc(0,0,25,0,Math.PI*2); 
        ctx.stroke();
    }

}
function DrawDefaultPattern(){
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = 450;
        ctx.canvas.height = 250;
        ctx.translate(225, 220)
        for (var i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.lineTo(150,0);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeRect(150, -25, 50, 55);
            ctx.rotate(-Math.PI*22.5/180);
        }    
        ctx.beginPath();
        ctx.arc(0,0,25,0,Math.PI*2); 
        ctx.stroke();
        ctx.save();
    }

}
function DrawHitPattern(channel){
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.canvas.width = 450;
        ctx.canvas.height = 250;
        ctx.translate(225, 220)
        ctx.fillStyle = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",0,0.5)";
        for (var i = 0; i < 9; i++) {
            if(i==channel-1){
                ctx.beginPath();
                ctx.moveTo(250, (Math.random()-0.5)*50);
                ctx.lineTo(-250, (Math.random()-0.5)*48);
                ctx.stroke();
            }
            ctx.beginPath();
            if(i == channel-1){
                ctx.fillRect(150, -25, 50, 55);
            }
            ctx.strokeRect(150, -25, 50, 55);
            ctx.rotate(-Math.PI*22.5/180);
        }    
        ctx.beginPath();
        ctx.arc(0,0,25,0,Math.PI*2); 
        ctx.stroke();
        ctx.fill();



    }

}
DrawDefaultPattern()
