var express=require('express');
var async = require("async");
var cheerio = require('cheerio');
var app=express();
var request = require('request')
var url = require('url')
require('./router/main')(app,request,cheerio,async);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var server=app.listen(3000,function(){
console.log("Express is running on port 3000");
});