'use strict';

var jschan = require('jschan');
var server = jschan.spdyServer();
var spline = require('../lib/splineStream')();



function handleReq(req) {
  req.dataStream.pipe(spline).pipe(req.returnChannel);
}



function handleChannel(channel) {
  channel.on('data', handleReq);
}



function handleSession(session) {
  session.on('channel', handleChannel);
}



server.on('session', handleSession);
server.listen(9323);




