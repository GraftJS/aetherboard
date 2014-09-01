/**
* @file: server-side entry point.
*
* Builds a local canvas, and orchestrates
* everybody's input into a single stream
* of changes to be applied everywhere.
*/
var graft = require('graft')();

// listen on websockets, in addition to in-mem
var ws = require('graft/websocket');
var server = ws.server('/graft');

server.pipe(graft);

// individual stream through streams
var spline = require('./service/spline');
var merge = require('./service/merge');

// shared canvas.
var Canvas = require('canvas');
var canvas = canvas(500, 500);

// handle pubsub
var broker = require('./lib/broker')(graft);
var stream = broker.stream;
var through = require('through2');


// we receive a subscribe message over graft
stream.on('subscribe', function(req, done) {
  var msg = req.msg;

  // send the initial canvas to the client
  canvas.pngStream().pipe(msg.initialCanvas);

  // send all clients' draw events to graft.
  msg.drawInput.pipe(graft);

  // send future merged draw events to the client
  merge.pipe(msg.drawnSync);

  done();
});

// all draw events from all clients
graft.readable('stroke').pipe(through.obj(function(req, enc, done) {
  var msg = req.msg;

  // start a new stroke, turn it into a spline
  // and merge into the shared data.
  msg.stroke.pipe(spline()).pipe(merge);

  done();
}));

// TODO: should merge just be a sub-graft?
merge.pipe(through.obj(function(req, enc, done) {

}));
