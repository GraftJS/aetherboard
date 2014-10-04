// file: main entry point for webpack
//
var through = require('through2');
var stream = require('readable-stream');

var ui = window.ui = require('./ui');
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

graft.write(msg);

// var toArray = require('stream-to-array');
// toArray(initialCanvas, function(err, arr) {
//   if (err) { return false; }
//   var buff = Buffer.concat(arr);
//   ui.loadPng(buff);
// }));

msg.strokeSync
  .pipe(spline())
  .pipe(invoke(ui));

input(ui.sync)
  .pipe(msg.strokeInput);
