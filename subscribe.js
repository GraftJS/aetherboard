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

    d.on('error', function(err) { log('ending of client '+client+' with error: '+err); });

    d.run(function() {

      merge
        .pipe(logStream('sending merged stroke %s to: '+client))
        .on('error', function() { log('error on sending merged stroke'); })
        .pipe(msg.strokeSync);

      msg.strokeInput
        .pipe(logStream('incoming stroke %s from: '+client))
        .pipe(through.obj(function(chunk, enc, done) {
          var msg = {
            topic: chunk.topic,
            size: chunk.size,
            color: chunk.color,
            segments: through.obj()
          };
          chunk.segments.pipe(msg.segments);
          merge.write(msg);
          done();
        }));
      done();
    });
  });
};
