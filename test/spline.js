'use strict';

var fs = require('fs');
var spline = require('../spline');
var _ = require('highland');

describe('spline memory service test', function() {
  it('should send a set of points and recieve a set of canvas insructions', function(done) {

    var data = _(require('./fixtures/points.json'));

    var drawn = data.pipe(spline());

    drawn.on('data', function(res) {
      console.log(res);
    });

    drawn.on('end', function() {
      done();
    });
  });
});

