var express = 	require('express'),
	router 	=	express.Router();


module.exports = function(){
	router.get('/', function(req, res){
		console.log('hello')
		res.render('index');
	});
	return router
}