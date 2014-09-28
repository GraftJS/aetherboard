var Canvas = require('./canvas');
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  var points = [];

  var ctx = Canvas();

  return through.obj(function(line, enc, done) {
    var ops = this;
    line.segments.on('data', function(chunk) {
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
      points = [];
      done();
    });
  });
};
