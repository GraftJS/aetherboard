// file: main entry point for webpack

var debug = window.debug = require('debug');
var log = debug('ab:client');
var logStream = require('debug-stream')(log);

// services
var ui = window.ui = require('./ui');
var input = require('./input');
var invoke = require('./invoke');
var spline = require('./spline');

// graft and ws client
var graft = require('graft')();
var client = require('graft/ws').client({port: 3000});

// subscribe to whiteboard
graft.where({topic: 'subscribe'}, client);

var msg = {
  topic: 'subscribe',
  strokeInput:  graft.WriteChannel(),
  strokeSync: graft.ReadChannel()
};

graft.write(msg);

// draw everybody's strokes on the board
msg.strokeSync
  .pipe(logStream('incoming stroke'))
  .pipe(spline())
  .pipe(invoke(ui));

// send my strokes to the server
input(ui.sync)
  .pipe(logStream('sending stroke'))
  .pipe(msg.strokeInput);
