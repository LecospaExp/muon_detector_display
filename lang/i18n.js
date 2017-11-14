var i18n = require('i18n');

i18n.configure({
    locales:['en', 'zh-tw'],
    directory: __dirname + '/locales',
    defaultLocale: 'zh-tw',
    cookie: 'lang',
});

module.exports = function(req, res, next) {

    i18n.init(req, res);
    res.locals.__ = res.__ = function() {
        return i18n.__.apply(req, arguments);
    };

    var current_locale = i18n.getLocale();

    return next();
};