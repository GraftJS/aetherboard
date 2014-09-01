var Readable = require('readable-stream').Readable;

module.exports = function Input(sync) {
  var current;
  var strokes = new Readable({objectMode: true});

  strokes._read = function() {};

  sync.on('start', function(data) {
    current = {
      size: 0.5,
      color: 1,
      segments: new Readable({objectMode: true})
    };
    current.segments._read = function() {};
    strokes.push(current);
  });

  sync.on('update', function(data) {
    var chunk = {
      position: [data.offsetX, data.offsetY],
      delta: data.delta,
      velocity: data.velocity
    };
    current.segments.push(chunk);
  });

  sync.on('end', function(data) {
    current.segments.push(null);
  });

  return strokes;
};
