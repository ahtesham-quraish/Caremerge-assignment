var express=require('express');
var Q = require('q');
var cheerio = require('cheerio');
var app=express();
var request = Q.denodeify(require('request'));
var url = require('url')
require('./router/main')(app,request,cheerio,Q);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var server=app.listen(3000,function(){
console.log("Express is running on port 3000");
});