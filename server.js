/**
* @file: server-side entry point.
*
* Builds a local canvas, and orchestrates
* everybody's input into a single stream
* of changes to be applied everywhere.
*/
var through = require('through2');
//
// shared canvas.
var Canvas = require('canvas');
var canvas = canvas(500, 500);

// Set up main graft instance
var Graft = require('graft');
var graft = Graft();

// listen on websockets, in addition to in-mem
var ws = require('graft/websocket');
var server = ws.server('/graft');

server.pipe(graft);

// individual stream through streams
var spline = require('./service/spline');

// second in-memory graft channel to merge channels in.
var merge = Graft();

// handle pubsub
var broker = require('./lib/broker');

// the broker is just a service
var brokerStream = graft.pipe(broker());

// we receive a subscribe message over graft
brokerStream.on('subscribe', function(req, done) {
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
//
// start a new stroke, turn it into a spline
// and merge into the shared data.
graft
  .pipe(where({topic: 'stroke'}))
  .pipe(prop('msg'))
  .pipe(spline())
  .pipe(merge);
