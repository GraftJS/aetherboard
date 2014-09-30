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

// initial image loaded into the canvas
// initialCanvas.pipe(ui.image);

var inputStream = input(ui.sync);

var log = through.obj(function(chunk, enc, done) {
  console.log(chunk);
  done(null, chunk);
});

msg.strokeSync
  .pipe(spline())
  .pipe(log)
  .pipe(invoke(ui));

inputStream
  .pipe(msg.strokeInput);

var sink = through.obj(function(chunk, enc, done) {
  done();
});
