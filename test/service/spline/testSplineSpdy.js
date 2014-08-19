'use strict';

var fs = require('fs');
var jschan = require('jschan');
var exec = require('child_process').exec;


describe('spline spdy service test', function() {
  var child;

  beforeEach(function(done) {
    child = exec('node ../../../service/spline/serviceSpdy', function (error, stdout, stderr) {
      console.log(error);
      console.log('out: ' + stdout);
      console.log('err: ' + stderr);
    });
    setTimeout(function() {
      done();
    }, 1000);
  });



  afterEach(function() {
    child.kill();
  });



  it('should send a set of points and recieve a set of canvas insructions', function(done) {
    var session = jschan.spdyClientSession({port: 9323});
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

