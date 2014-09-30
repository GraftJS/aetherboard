var streams  = require('readable-stream');
var Readable = streams.Readable;
var Graft    = require('graft');

module.exports = function Input(sync) {
  var current;
  var strokes = new Graft();

  sync.on('start', function(data) {
    current = {
      topic: 'stroke',
      size: 0.5,
      color: 1,
      segments: strokes.WriteChannel()
    };

    strokes.write(current);
  });

  sync.on('update', function(data) {
    var chunk = {
      x: data.offsetX,
      y: data.offsetY
    };
    current.segments.write(chunk);
  });

  sync.on('end', function(data) {
    current.segments.push(null);
    current.segments = null
    current = null;
  });

  return strokes;
};
