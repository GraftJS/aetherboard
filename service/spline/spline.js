'use strict';

var ctx = require('./canvas')();
var Spline = require('./bezier-spline');
var through = require('through2');

module.exports = function() {
  return through.obj(function(chunk, enc, done) {
    console.log(chunk);
    var points = [];
    var spline;
    var that = this;

    chunk.pipe(through.obj(function(_data, enc, done) { 
      points.push(_data);
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


