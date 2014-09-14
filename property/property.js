var through = require('through2');
var norma = require('norma');

var pickArgs = norma.compile('property:s');

module.exports = function Property() {
  var args = pickArgs(arguments);
  var prop = args.property;

  return through.obj(function(chunk, enc, done) {
    this.push(chunk[prop]);
    done();
  });
};
