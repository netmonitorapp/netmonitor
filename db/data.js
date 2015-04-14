var app = require('simple-app');
var mongoose = app.mongoose;
var config = app.config;

var Data = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date(),
    },
    isNetAlive: {
        type: Boolean,
        default: false,
    },
    isNetDown: {
        type: Boolean,
        get: function() {
            return !this.isNetAlive;
        },
        set: function(value) {
            this.isNetAlive = !value;
        },
    },
});

Data.statics.getLatest = function(done) {
    this.findOne({}, {}, {
        sort: {
            'created_at': -1
        }
    }, done);
}
Data.statics.getLatestAlive = function(done) {
    this.findOne({
        isNetAlive: true
    }, {}, {
        sort: {
            'created_at': -1
        }
    }, done);
}
Data.statics.getLatestDown = function(done) {
    this.findOne({
        isNetAlive: false
    }, {}, {
        sort: {
            'created_at': -1
        }
    }, done);
}

Data = module.exports = mongoose.model('data', Data);
