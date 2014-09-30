/**
* @file: server-side entry point.
*
* Builds a local canvas, and orchestrates
* everybody's input into a single stream
* of changes to be applied everywhere.
*/
var through = require('through2');

var http = require('http');
var server = http.createServer();

var Canvas = require('canvas');
var canvas = new Canvas(1920, 1080);

var invoke = require('./invoke');
var spline = require('./spline');

var Graft = require('graft');

var graft = Graft();

require('graft/ws')
  .server({server: server})
  .pipe(graft);

var merge = Graft();

graft.where({topic: 'subscribe'}, subscribe());
graft.where({topic: 'stroke'}, strokes());

function strokes() {
  var service = Graft();
  service.pipe(merge);

  //service.pipe(spline())
  //  .pipe(invoke(canvas));

  return service;
}

function subscribe() {
  return through.obj(function(msg, enc, done) {
    //canvas.pngStream().pipe(msg.initialCanvas);
    msg.strokeInput.pipe(graft);
    merge.pipe(msg.strokeSync);

    done();
  });
}

server.on('request', require('./handler')).listen(3000);
