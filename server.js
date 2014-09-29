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
var canvas = new Canvas(500, 500);

var invoke = require('./invoke');
var spline = require('./spline');

var Graft = require('graft');

var graft = Graft();
var merge = Graft();

require('graft/ws')
  .server({server: server})
  .pipe(graft);

var drawOnCanvas = through.obj()
  .pipe(spline())
  .pipe(through.obj(function(chunk, enc, done) { done(); }));

graft.where({topic: 'subscribe'}, subscribe());
graft.where({topic: 'stroke'}, spline());

function subscribe() {
  return through.obj(function(msg, enc, done) {
    //canvas.pngStream().pipe(msg.initialCanvas);

    msg.strokeInput.pipe(graft);

    merge.pipe(msg.strokeSync);

    this.push(msg);
    done();
  });
}

server.on('request', require('./handler')).listen(3000);
