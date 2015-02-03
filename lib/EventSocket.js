var net = require('net');
var util = require('util');
var events = require('events');

var JsonSocket = require('jsonsocket');
var log = require('debug')('EventSocket:connection');
var dataLog = require('debug')('EventSocket:data');

var version = require('../package.json').version;

function isString(s) {
    return (typeof s === 'string' || s instanceof String);
}

function EventSocket(ip, port) {
    var eventSocket = this;
    var socket;
    if (isString(ip)) {
        log('connecting... %s:%s', ip, port);
        socket = new JsonSocket(ip, port);
    } else if (ip instanceof JsonSocket) {
        socket = ip;
    } else if (ip instanceof net.Socket) {
        socket = new JsonSocket(ip);
    } else {
        return;
    }

    socket.on('connect', function () {
        emit('connect');
    });
    socket.on('json', function (json) {
        if (isString(json.name)) {
            var args = json.args;
            if (args === undefined) {
                args = [json.name];
            }
            json.args.unshift(json.name);
            dataLog('receive %s %s', json.name, JSON.stringify(args));
            _emit.apply(eventSocket, args);
        }
    });
    socket.on('disconnect', function () {
        emit('disconnect');
    });

    socket.on('error', function (ex) {
        log(ex);
        emit('error', ex);
    });

    eventSocket.disconnect = function () {
        socket.disconnect();
    };

    var _emit = eventSocket.emit;

    var emit = function () {
        _emit.apply(eventSocket, arguments);
    };

    eventSocket.emit = function () {
        var args = Array.prototype.slice.call(arguments);
        var name = args.shift();
        dataLog('send %s %s', name, JSON.stringify(args));
        socket.write({
            name: name,
            args: args
        });
    };

}
util.inherits(EventSocket, events.EventEmitter);

module.exports = EventSocket;
module.exports.version = version;