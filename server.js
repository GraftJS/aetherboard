/**
* @file: server-side entry point.
*/

var log       = require('debug')('ab:server');
var domain    = require('domain');
var http      = require('http');
var server    = http.createServer();

var graft     = require('graft')();
var ws        = require('graft/ws');
var subscribe = require('./subscribe');

graft.where({topic: 'subscribe'},  subscribe());

domain.create()
  .on('error', function() { log('connection error'); })
  .run(function() {
    log('starting websocket server');

    ws.server({server: server})
      .pipe(graft);
  });

server.on('request', require('./handler')).listen(3000);
