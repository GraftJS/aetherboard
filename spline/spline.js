var Canvas = require('./canvas');
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  var points = [];
  var ctx = Canvas();

  return through.obj(function(chunk, enc, done) {
    points.push(chunk);
    done();
  }, function() {
    var spline = new Spline({points: points, duration:15000});

    spline.draw(ctx);

    ctx.operations().forEach(pushOp.bind(this));
    function pushOp(op) { this.push(op); }
    this.push(null);
  });
};
