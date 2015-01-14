/**
* @file: server-side entry point.
*/

var log       = require('debug')('ab:server');
var domain    = require('domain');
var http      = require('http');
var server    = http.createServer();

var canvas    = new (require('canvas'))(1920, 1080);

var graft     = require('graft');
var ws        = require('graft/ws');
var subscribe = require('./subscribe');
var invoke    = require('./invoke');

var main      = graft();
var merge     = graft();

main.where({topic: 'subscribe'},  subscribe(merge));

merge.pipe(invoke(canvas));

domain.create()
  .on('error', function() { log('connection error'); })
  .run(function() {
    log('starting websocket server');

    ws.server({server: server})
      .pipe(main);
  });

server.on('request', require('./handler')).listen(3000);
