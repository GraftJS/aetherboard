'use strict';

var ctx = require('./canvas')();
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  return through.obj(function(chunk, enc, done) {
    var points = [];
    var spline;
    var that = this;

    chunk.pipe(through.obj(function(_data, enc, done) { 
      var pos = _data.position;
      points.push({
        x: pos[0],
        y: pos[1]
      });
      done();
    }, function() {
      spline = new Spline({points: points, duration:15000});
      spline.draw(ctx);
      ctx.operations().forEach(function(operation) { that.push(operation); });
      points = [];
    }));
    done();
  });
};


