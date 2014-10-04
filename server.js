/**
* @file: server-side entry point.
*/
var through = require('through2');

var domain = require('domain');
var http = require('http');
var server = http.createServer();

var debug = require('debug')('ab:server');
var debugStream = require('debug-stream')(debug);

var Graft = require('graft');
var graft = Graft();

var d = domain.create();
d.on('error', debug.bind(null, 'connection error'));

d.run(function() {
  require('graft/ws')
    .server({server: server})
    .pipe(graft);
});

var merge = Graft();

graft.where({topic: 'subscribe'}, subscribe());
graft.where({topic: 'stroke'}, merge);

var active = 0;
function subscribe() {
  return through.obj(function(msg, enc, done) {

    var client = active++;
    debug('receive subscribe message: '+client);

    var d = domain.create();

    d.on('error', debug.bind(null, 'handle ending of client: '+client));

    d.run(function() {

      msg.strokeInput
        .pipe(debugStream('incoming stroke %s from: '+client))
        .pipe(graft);

      merge
        .pipe(debugStream('sending merged stroke %s to: '+client))
        .pipe(msg.strokeSync);

      done();
    });

  });
}

server.on('request', require('./handler')).listen(3000);
