'use strict';

var Canvas = require('./canvas');
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  return through.obj(function(chunk, enc, done) {
    var points = [];
    var that = this;

    chunk.pipe(through.obj(function(_data, enc, done) {
      points.push(_data);
      done();
    }, function() {

      var ctx = Canvas();
      var spline = new Spline({points: points, duration:15000});

      spline.draw(ctx);
      points = [];

      ctx.operations().forEach(function(operation) {
        that.push(operation);
      });
    }));
    done();
  });
};
