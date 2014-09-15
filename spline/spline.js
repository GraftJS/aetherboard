var Canvas = require('./canvas');
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  var points = [];

  return through.obj(function(chunk, enc, done) {
    points.push(chunk);

    if (points.length >= 2) {
      var ctx = Canvas();
      var spline = new Spline({points: points, duration:15000});

      spline.draw(ctx);

      ctx.operations().forEach(pushOp.bind(this));
    } else {
      this.push('draw', 'clearRect', 0, 0, 499, 499);
    }

    done();

    function pushOp(op) { this.push(['draw'].concat(op)); }
  });

};
