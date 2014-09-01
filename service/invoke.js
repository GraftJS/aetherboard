var through = require('through2');
var norma = require('norma');

var invokeArgs = norma.compile('{method:s, opts:.*}');

module.exports = function Invoke(context) {
  return through.obj(function(chunk, enc, done) {
    var args = invokeArgs(chunk);
    var method = args.method;
    var opts = args.opts;
    if (context[method]) {
      var result = context[method].apply(context, opts);
      if (result) { this.push(result); }
    }
    done();
  });
};
