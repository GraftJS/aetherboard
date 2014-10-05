var debug = require('debug');
var log = debug('ab:input');
var verbose = debug('verbose:ab:input');

var streams  = require('readable-stream');

var Readable = streams.Readable;
var Graft    = require('graft');

module.exports = function Input(sync) {
  var current;
  var count = 0;
  var segs = [];
  var strokes = new Graft();

  sync.on('start', function(data) {
    count++;
    log('start stroke %d',count);
    current = {
      topic: 'stroke',
      size: 0.5,
      color: 1,
      segments: strokes.WriteChannel()
    };

    strokes.write(current);
  });

  sync.on('update', function(data) {
    verbose('segment %d [%d,%d]', segs.length, data.offsetX, data.offsetY);

    var chunk = {
      x: data.offsetX,
      y: data.offsetY
    };
    segs.push(chunk);

    current.segments.write(chunk);
  });

  sync.on('end', function() {
    log('end stroke %d', count);
    current.segments.end();
    current = null;
    segs = [];
  });

  return strokes;
};
