var domain    = require('domain');
var through   = require('through2');
var graft     = require('graft');

var debug     = require('debug');
var log       = debug('ab:subscribe');
var logStream = require('debug-stream')(log);

module.exports = function subscribe() {
  var merge = graft();

  var active = 0;

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
};
