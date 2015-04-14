var app = require('simple-app');
var mongoose = app.mongoose;
var config = app.config;

var Hosts = new mongoose.Schema({
    name: String,
    url: String,
    isNet: Boolean,
});


var defaults = [{
    name: '[Router]',
    url: '192.168.1.1',
}, {
    name: '[Airtel]',
    url: '202.56.215.28',
}, {
    name: '[Google',
    url: '8.8.8.8',
}, {
    name: '\b.com]',
    url: 'google.com',
    isNet: true,
}, {
    name: '[StackOverflow',
    url: 'stackoverflow.com',
}, {
    name: 'Reddit]',
    url: 'reddit.com',
}, ];


// Hosts = module.exports = mongoose.model('hosts', Hosts);
module.exports = defaults;
