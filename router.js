var express = 	require('express'),
	router 	=	express.Router();
	i18n 	= 	require('i18n');

module.exports = function(){
	// router.get(/(^[\/a-zA-z0-9]*)\/cht/, function(req, res){
	// 	i18n.setLocale(req, 'cht');
	// 	res.redirect(/(^[\/a-zA-z0-9]*)\/cht/.test(req.originalUrl)[1])
	// })
	// router.get(/(^[\/a-zA-z0-9]*)\/en/, function(req, res){
	// 	i18n.setLocale(res, 'en');
	// 	console.log(/(^[\/a-zA-z0-9]*)\/en/.test(req.originalUrl)[1])
	// 	res.redirect('/')
	// })
	
	router.get('/', function(req, res){
		res.render('index');
		console.log(res.getLocale())
	});

	return router
}