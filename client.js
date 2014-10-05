// file: main entry point for webpack
//
var through = require('through2');
var stream = require('readable-stream');

var ui = window.ui = require('./ui');
var debug = window.debug = require('debug');

var log = debug('ab:client');
var logStream = require('debug-stream')(log);

var input = require('./input');
var invoke = require('./invoke');
var spline = require('./spline');

var graft = require('graft')();

var client = require('graft/ws').client({port: 3000});

graft.where({topic: 'subscribe'}, client);

var msg = {
  topic: 'subscribe',
  strokeInput:  graft.WriteChannel(),
  strokeSync: graft.ReadChannel(),
  initialCanvas: graft.ReadChannel()
};

log('send subscribe message');

graft.write(msg);

// var toArray = require('stream-to-array');
// toArray(initialCanvas, function(err, arr) {
//   if (err) { return false; }
//   var buff = Buffer.concat(arr);
//   ui.loadPng(buff);
// }));

msg.strokeSync
  .on('end', log.bind(null, 'stroke sync ended'))
  .pipe(logStream('incoming stroke'))
  .pipe(spline())
  .pipe(invoke(ui));

input(ui.sync)
  .pipe(logStream('sending stroke'))
  .pipe(msg.strokeInput);
