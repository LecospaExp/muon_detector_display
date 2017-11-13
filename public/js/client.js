var socket = io('http://localhost:9487');

var channel_count = [0,0,0,0,0,0,0,0,0];


(function(){
	var d3 = Plotly.d3;

	var WIDTH_IN_PERCENT_OF_PARENT = 60,
	    HEIGHT_IN_PERCENT_OF_PARENT = 80;

	var gd3 = d3.select('body')
	    .append('div')
	    .style({
	        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
	        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

	        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
	        'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
	    });

	var gd = gd3.node();

	var data_set = {
		type: 'bar',
		x: [1, 2, 3, 4, 5, 6, 7, 8, 9],
	    y: channel_count,
	    marker:{
	    	color: '#C8A2C8',
	    	line: {width: 2.5}
	    } 
	};

	var data = [data_set];

	var layout = {
		title: 'Count-Channel',
		font: {size: 16}
	};

	Plotly.plot(gd, data, layout, {displayModeBar: false});

	window.onresize = function() {
	    Plotly.Plots.resize(gd);
	};
	socket.on('hit', function(channel_number){
		console.log(channel_number);
		channel_count[channel_number-1] += 1;

		Plotly.redraw(gd);

	});
})();