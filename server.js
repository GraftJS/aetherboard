/**
* @file: server-side entry point.
*/
var through = require('through2');

var domain = require('domain');
var http = require('http');
var server = http.createServer();

var debug = require('debug');
var log = debug('ab:server');
var logStream = require('debug-stream')(log);

var Graft = require('graft');
var graft = Graft();

var d = domain.create();
d.on('error', log.bind(null, 'connection error'));

d.run(function() {
  log('starting websocket server');

  require('graft/ws')
    .server({server: server})
    .pipe(graft);
});

var merge = Graft();

graft.where({topic: 'subscribe'}, subscribe());

var active = 0;
function subscribe() {
  return through.obj(function(msg, enc, done) {

    var client = active++;
    log('receive subscribe message: '+client);

    var d = domain.create();

    d.on('error', debug.bind(null, 'handle ending of client: '+client));

    d.run(function() {

      msg.strokeInput
        .pipe(logStream('incoming stroke %s from: '+client))
        .pipe(merge);


      merge
        .pipe(logStream('sending merged stroke %s to: '+client))
        .pipe(msg.strokeSync);

      done();
    });

  });
}

server.on('request', require('./handler')).listen(3000);
