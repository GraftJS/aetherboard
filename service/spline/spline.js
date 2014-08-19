'use strict';

var stream = require('stream');
var ctx = require('./canvas')();
var Spline = require('./bezier-spline');

module.exports = function() {
  var _ts = new stream.Transform({objectMode: true});
  var _data = '';

  _ts._transform = function(chunk, encoding, done) {
    var points;
    var spline;

    _data += chunk.toString();
    try {
      points = JSON.parse(_data);
      _data = '';
    }
    catch (e){
    }

    if (_data.length === 0) {
      spline = new Spline({points: points, duration:15000});
      spline.draw(ctx);
      ctx.operations().forEach(function(operation) {
        _ts.push(operation);
      });
    }
    done();
  };

  return _ts;
};


