var through = require('through2');
var _ = require('lodash');

module.exports = function Invoke(context) {
  return through.obj(function(chunk, enc, done) {
    var args = _.toArray(chunk);
    var method = _.first(args);
    var opts = _.rest(args);

    context[method] && context[method].apply(context, opts);
    done();
  });
};
