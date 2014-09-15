// file: main entry point for webpack
var through = require('through2');

// require my services
var ui = window.ui = require('./ui');
var input = require('./input');
var prop = require('dotpath-stream');
var invoke = require('./invoke');
var spline = require('./spline');
var map = require('through2-map');
var normPoints = require('./lib/normalize-points');

// set up graft, websockets and return channel streams.
var graft = require('graft')();

//var client = require('graft/ws').client();
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
//initialCanvas.pipe(ui.image);

// normalize mouse input into strokes+segments
var inputStream = input(ui.sync);

// send my strokes to the server
//inputStream.pipe(strokeInput);

inputStream
  .pipe(prop('segments'))
  .pipe(normPoints())
  .pipe(spline())
  .pipe(invoke(ui));
