/**
* @file: handle http requests.
*/

var send = require('send');
var url = require('url');

module.exports = function handleRequest(req, res){
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
};
