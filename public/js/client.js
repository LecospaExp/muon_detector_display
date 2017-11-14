var socket = io('http://140.112.104.83:9487');

var count = [76,43,110,100,40,55,50,23,90];
    
var ctx = document.getElementById("count-channel");
var count_channel = new Chart(ctx, {
	type: 'bar',
    data: {
    	labels: ["1","2","3","4","5","6","7","8","9"],
    	datasets: [
    		{
    			labels: "Count",
    			backgroundColor: "#3e95cd",
    			data: count
    		}
    	]
    },
    options: {
    	title: {
    		display: true,
    		text: "Count-Channel"
    	},
    	responsive: false
	}
    var result = regression.linear([[1,2], [3, 4], [5, 6]]);
    console.log(result.equation[0])
    console.log(result.equation[1])
});

socket.on('hit', function(channel_number){
	console.log(channel_number);
	channel_count[channel_number-1] += 1;

	count_channel.update();

});