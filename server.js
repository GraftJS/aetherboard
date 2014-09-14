/**
* @file: server-side entry point.
*
* Builds a local canvas, and orchestrates
* everybody's input into a single stream
* of changes to be applied everywhere.
*/
var through = require('through2');
var send = require('send');
var url = require('url');

var Canvas = require('canvas');
var canvas = new Canvas(500, 500);

var Graft = require('graft');
var graft = Graft();
var merge = Graft();

var http = require('http');
var server = http.createServer();
var ws = require('graft/ws').server({server: server});

ws.pipe(graft);

graft.where({topic: 'subscribe'}, subscribe());

server.on('request', handleRequest);
server.listen(3000);

function subscribe() {
  return through.obj(function(msg, enc, done) {
    canvas.pngStream().pipe(msg.initialCanvas);

    msg.strokeInput.pipe(graft);

    merge.pipe(msg.strokeSync);

    this.push(msg);
    done();
  });
}

function handleRequest(req, res){
  console.log(req.method, req.url);

  function error(err) {
    res.statusCode = err.status || 500;
    res.end(err.message);
  }

  function redirect() {
    res.statusCode = 301;
    res.setHeader('Location', req.url + '/');
    res.end('Redirecting to ' + req.url + '/');
  }

  send(req, url.parse(req.url).pathname, {root: __dirname + '/dist'})
    .on('error', error)
    .on('directory', redirect)
    .pipe(res);
}
