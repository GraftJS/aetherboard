// converts famous input events to the input needed for spline
var through = require('through2');

module.exports = function() {
  return through.obj(function(chunk, enc, done) {
    var points = this;
    chunk.on('data', function(data) {
      var pos = data.position;
      points.push({
        x: pos[0],
        y: pos[1]
      });
    });
    chunk.on('end', done.bind(null, null));
  });
};
