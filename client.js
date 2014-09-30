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

var strokeInput = graft.WriteChannel();
var strokeSync = graft.ReadChannel();
var initialCanvas = graft.ReadChannel();

graft.where({topic: 'subscribe'}, client);

graft.write({
  topic: 'subscribe',
  strokeInput: strokeInput,
  strokeSync: strokeSync,
  initialCanvas: initialCanvas
});

// initial image loaded into the canvas
// initialCanvas.pipe(ui.image);

var inputStream = input(ui.sync);

inputStream
  .pipe(spline())
  .pipe(through.obj(log))
  .pipe(invoke(ui));

inputStream
  .pipe(strokeInput);

function log(chunk, enc, done) {
  console.log(chunk);
  done(null, chunk);
}
