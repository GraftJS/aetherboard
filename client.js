// file: main entry point for webpack
var through = require('through2');
var stream = require('readable-stream');

// require my services
var ui = window.ui = require('./ui');
var input = require('./input');
var invoke = require('./invoke');
var spline = require('./spline');

// set up graft, websockets and return channel streams.
var graft = require('graft')();

var client = require('graft/ws').client({port: 3000});

graft.where({topic: 'subscribe'}, client);

var msg = {
  topic: 'subscribe',
  strokeInput:  graft.WriteChannel(),
  strokeSync: graft.ReadChannel(),
  initialCanvas: graft.ReadChannel()
};

graft.write(msg);

// var toArray = require('stream-to-array');
// toArray(initialCanvas, function(err, arr) {
//   if (err) { return false; }
//   var buff = Buffer.concat(arr);
//   ui.loadPng(buff);
// }));

var inputStream = input(ui.sync);

msg.strokeSync
  .pipe(spline())
  .pipe(invoke(ui));

inputStream
  .pipe(msg.strokeInput);
