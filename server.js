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

var Graft = require('graft');

var graft = Graft();

require('graft/ws')
  .server({server: server})
  .pipe(graft);

graft.where({topic: 'subscribe'}, subscribe());

var merge = Graft();

function subscribe() {
  return through.obj(function(msg, enc, done) {
    canvas.pngStream().pipe(msg.initialCanvas);

    msg.strokeInput.pipe(graft);

    merge.pipe(msg.strokeSync);

    this.push(msg);
    done();
  });
}


server.on('request', require('./handler')).listen(3000);
