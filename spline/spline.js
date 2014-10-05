var debug = require('debug');
var log = debug('ab:spline');
var verbose = debug('verbose:ab:spline');

var through = require('through2');

module.exports = function() {
  var points = [];

  //var ctx = Canvas();
  return through.obj(function(line, enc, done) {
    var ops = this;

    line.segments.on('data', function(chunk) {
      verbose('receive segment %d [%d, %d]', points.length, chunk.x, chunk.y);
      if (!points.length) {
        ops.push(['draw', 'beginPath']);
        ops.push(['draw', 'moveTo', chunk.x, chunk.y]);
      } else {
        ops.push(['draw', 'lineTo', chunk.x, chunk.y]);
        ops.push(['draw', 'stroke']);
      }

      points.push(chunk);
    });
    line.segments.on('end', function() {
      log('end line segment %d', points.length);

      points = [];
      done();
    });
  });
};
