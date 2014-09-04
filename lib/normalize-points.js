// converts famous input events to the input needed for spline
var through = require('through2');

module.exports = function() {
  return through(function(_data, enc, done) {
    var pos = _data.position;
    this.push({
      x: pos[0],
      y: pos[1]
    });
    done();
  });
};
