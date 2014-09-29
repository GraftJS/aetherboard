// file: main entry point for webpack
var through = require('through2');
var _ = require('highland');

// require my services
var ui = window.ui = require('./ui');
var input = require('./input');
var invoke = require('./invoke');
var spline = require('./spline');

// set up graft, websockets and return channel streams.
var graft = require('graft')();

var client = require('graft/ws').client({port: 3000});
graft.pipe(client);

var strokeInput = graft.ReadChannel();
var strokeSync = graft.WriteChannel();
var initialCanvas = graft.WriteChannel();

graft.write({
  topic: 'subscribe',
  strokeInput: strokeInput,
  strokeSync: strokeSync,
  initialCanvas: initialCanvas
});

// initial image loaded into the canvas
// initialCanvas.pipe(ui.image);

var inputStream = _(input(ui.sync));

var drawStream = inputStream.fork();
var sendStream = inputStream.fork();

sendStream
  .pipe(graft)
  .pipe(through.obj(log))

drawStream
  .pipe(spline())
  .pipe(invoke(ui));

function log(chunk, enc, done) {
  console.log(chunk);
  done();
}
