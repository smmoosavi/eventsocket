# eventsocket
Event socket

## Install

```
$ npm install eventsocket
```

## Usage

```js
var EventSocket = require('eventsocket');
```

## Methods

### `EventSocket(ip, port)`

Create new event socket from ip and port.

```js
var socket = new EventSocket('127.0.0.1', 7000);
```

### `EventSocket(socket)`

Create new event socket from existing`net.Socket` or [`JsonSocket`](https://github.com/smmoosavi/jsonsocket)

```js
var net = require('net');
var server = net.createServer(function (con) {
    var socket = new EventSocket(con);
}
```

### `emit(eventType, args...)`

Send event over socket.

```js
socket.emit('message',{foo: 'bar'});
```
### `disconnect()`

Destroy connection

### `on(eventType, listener)`

Inherited from `events.EventEmitter`

## Events
### connect
Emitted when socket connected (only when you pass ip, port).

### disconnect
Emitted when disconnected.

### Custom
Emitted event from peer 

### error

Emitted when net.Socket emit error.

> Error events are treated as a special case in node. If there is no listener for it,
> then the default action is to print a stack trace and exit the program.

[see more](http://nodejs.org/api/events.html#events_class_events_eventemitter).

### newListener, removeListener

Inherited from [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).
## Logging

You can enable logging. [See more](https://github.com/visionmedia/debug)

```bash
# disabled logging
node test.js

# connect, disconnect log
DEBUG=EventSocket:connection node test.js

# data log
DEBUG=EventSocket:data node test.js

# all event socket logs
DEBUG=EventSocket:* node test.js
```

## Protocol

We send json objects over socket then write one `\0`. This is c/c++ friendly protocol. :smile:

Json object has `name` and `args` property. `name` must be string and `args` must be array.

```
{"name":"message","args":[{"foo":"bar"}]}\0
```