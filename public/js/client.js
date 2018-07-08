//var socket = io('http://192.168.8.104:9487');
var socket = io('http://140.112.104.116:5001');

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

var Particle = function(){
    this.x = 500
    this.v = 20
    this.r = Math.random()
    this.g = Math.random()
    this.fillStyle = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",0,0.5)"
    this.move = function(scale) {
        this.x -= (this.v*scale)
    }
}
var Block = function(r, g, i){
    this.r = r
    this.g = g
    this.i = i
    this.decay = function(factor){
        this.i-=factor
        if(this.i<0.01){
            this.i=0.;
            // console.log('123')
        }
    }
    this.fillStyle = function(){
        if(this.i<0.001){
            return "rgba(0,0,0,0)"
        }else{
            return "rgba("+Math.floor(this.r*255.)+","+Math.floor(this.g*255.)+",0,"+this.i+")"
        }
    }
}
var paticleList = [];
var blockList = [];
for (var i = 0; i < 9; i++) {
    paticleList.push([]);
    blockList.push(new Block(0., 0., 0.))
}
//center
blockList.push(new Block(0., 0., 0.))

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
        maintainAspectRatio: false,
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
                    userCallback: function(label, index, labels) {
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
    				fontColor: "#000000",
    				fontSize: 20,
    				min: 0,
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
    	responsive: true
	}
    
});
socket.on('CurCount', function(countCh){
    console.log("curCount:"+countCh);
    count = countCh;
    count_angle.data.datasets[1].data = count;
    fitting()
    totalHit = count.reduce((a, b) => a + b, 0);
    $('#totalHit').html(totalHit);
});

socket.on('strTime', function(serverSideStrTime){
    console.log("strTime:"+serverSideStrTime);
    strTime = serverSideStrTime
    $('#totalTime').html(Math.round(Date.now()/1000) - strTime);
});
socket.on('hit', function(channel_number){
    if(channel_number==0)return;
	count[channel_number-1] += 1;
    count_angle.data.datasets[1].data = count;
    fitting()
    // DrawHitPattern(channel_number);
    console.log(channel_number)
    paticleList[channel_number-1].push(new Particle())
    totalHit += 1
    $('#totalHit').html(totalHit);
});

function timer(){
    $('#totalTime').html(Math.round(Date.now()/1000) - strTime); 
    $('#hitRate').html(Math.myround(totalHit/(Date.now()/1000 - strTime), 3))
    setTimeout(timer, 1000)
}

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
function resizeHist(){
    count_angle.update();
}

function reset() {
	count = [0,0,0,0,0,0,0,0,0];
	count_angle.data.datasets[1].data = count;
	fitting();
    socket.emit('reset')
    totalHit = 0
	$('#totalHit').html(totalHit)
	$('#totalTime').html(0)
	$('#hitRate').html(0)
    strTime = Math.round(Date.now()/1000)
	console.log('reset')
}

// button.onclick = function() {reset()};

socket.on('pressure', function(value){
	console.log("[pressure] "+value);
    $('#pressure').html(value);
});

var radiusBlock = 180
var width = 400
function draw(){
    if (canvas.getContext) {
        canvasReset = function(){}
        var ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-over';

        ctx.canvas.width = width*2;
        ctx.canvas.height = width;
        ctx.translate(width, width-40)
        
        ctx.rotate(-Math.PI*10/180);
        for (var i = 0; i < 9; i++) {
            for (var j = paticleList[9-i-1].length-1; j >=0 ; j--) {
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.beginPath();
                ctx.arc(paticleList[9-i-1][j].x,0,8,0,2*Math.PI);
                ctx.stroke();
                ctx.fill();
                // ctx.font="60px Georgia";
//                ctx.fillText("μ",paticleList[9-i-1][j].x,0);
                paticleList[9-i-1][j].move(1)
                if(paticleList[9-i-1][j].x>=radiusBlock&&paticleList[9-i-1][j].x<=radiusBlock+50){
                    blockList[i].r = paticleList[9-i-1][j].r
                    blockList[i].g = paticleList[9-i-1][j].g
                    blockList[i].i = 0.9
                }
                if(paticleList[9-i-1][j].x>=-25&&paticleList[9-i-1][j].x<=25){
                    blockList[9].r = paticleList[9-i-1][j].r
                    blockList[9].g = paticleList[9-i-1][j].g
                    blockList[9].i = 0.9
                }
                if(paticleList[9-i-1][j].x<-width){
                    paticleList[9-i-1].splice(j, 1)
                }
            }
            // if(i==9-channel){
            //     ctx.beginPath();
            //     ctx.lineWidth = 3
            //     ctx.moveTo(width, (Math.random()-0.5)*50);
            //     ctx.lineTo(-width, (Math.random()-0.5)*48);
            //     ctx.stroke();
            // }
            ctx.lineWidth = 1
            ctx.fillStyle = blockList[i].fillStyle()
            ctx.beginPath();
            ctx.fillRect(radiusBlock, -25, 50, 60);
            ctx.strokeRect(radiusBlock, -25, 50, 60);
            ctx.rotate(-Math.PI*20/180);
            blockList[i].decay(0.015)
        }    
        ctx.fillStyle = blockList[9].fillStyle()
        ctx.beginPath();
        ctx.arc(0,0,25,0,Math.PI*2); 
        ctx.stroke();
        ctx.fill();
        blockList[i].decay(0.05)
    }
    window.requestAnimationFrame(draw)

}
// DrawDefaultPattern()
draw()


