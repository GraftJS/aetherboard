'use strict';

var jschan = require('jschan');
var session = jschan.memorySession();
var spline = require('./spline')();



function handleReq(req) {
  req.dataStream.pipe(spline).pipe(req.returnChannel);
}



session.on('channel', function server(channel) {
  channel.on('data', handleReq);
});


exports.getSession = function() {
  return session;
};

