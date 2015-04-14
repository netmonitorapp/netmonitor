var console = require('unclog');
var app = require('simple-app');
var ping = require('ping').promise.probe;
var async = require('async');
var moment = require('moment');

var db = require('./db');
var Data = db.data;
var hosts = db.hosts;


var lastAlive = new Date();
var lastDown = new Date();
var isNetAlive = false;
// var isNetDown = !isNetAlive;
Object.defineProperty(global, 'isNetDown', {
    get: function() {
        return !isNetAlive;
    },
    set: function(value) {
        isNetAlive = !value;
    }
});

function pingWrapper(host, done) {
    ping(host.url, {
        // timeout: 1000,
        // extra: ["-i 2"],
    }).then(function(res) {
        var isAlive = res.alive;
        host.isAlive = isAlive;
        if (host.isNet) isNetAlive = host.isAlive;
        console[isAlive ? 'verbose' : 'debug'].stdout(host.name, '');
        done();
    });
}

function pingAll(hosts, done) {
    console.verbose.stdout(moment().format(' dddD HH:mm:ss '));
    async.mapSeries(hosts, pingWrapper, function() {
        setTimeout(done, 1000);
        var data = new Data({
            isNetAlive: isNetAlive
        }).save();
        if (isNetAlive) {
            lastAlive = new Date();
            console.verbose.stdout('Alive for', moment(lastDown).fromNow(1));
        } else {
            lastDown = new Date();
            console.err.stdout('Down for', moment(lastAlive).fromNow(1));
        }
        console.verbose.plain('');
    });
}

function repeatPingAll() {
    pingAll(hosts, repeatPingAll);
}

app.ready(function() {
    async.parallel([
        function getLatestAlive(next) {
            Data.getLatestAlive(function(err, data) {
                isNetAlive = data.isNetAlive;
                lastAlive = data.date;
                // console.debug('getLatestAlive:', 'isNetAlive:', isNetAlive);
                next();
            });
        },
        function getLatestDown(next) {
            Data.getLatestDown(function(err, data) {
                isNetDown = data.isNetDown;
                lastDown = data.date;
                // console.debug('getLatestDown:', 'isNetDown:', isNetDown);
                next();
            });
        },
    ], repeatPingAll);
});
