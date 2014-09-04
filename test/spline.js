'use strict';

var fs = require('fs');
var Graft = require('graft');
var spline = require('../spline');


describe('spline memory service test', function() {
  it('should send a set of points and recieve a set of canvas insructions', function(done) {
    var session = service.getSession();
    var sender = session.createWriteChannel();
    var response = sender.createReadChannel();
    var dataStream = fs.createReadStream('./points.json');
    var bs = sender.createByteStream();

    this.timeout(20000);

    response.on('data', function(res) {
      console.log(res);
    });


    response.on('close', function() {
      session.close();
      done();
    });


    sender.end({dataStream: bs, returnChannel: response});
    dataStream.pipe(bs);
  });
});

