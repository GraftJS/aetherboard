var Canvas = require('famous/surfaces/CanvasSurface');
var Sync   = require('./sync');
var _      = require('lodash');

function Whiteboard(options) {
  Canvas.apply(this, arguments);

  this.sync = Sync();

  this.on('deploy', this.initialize.bind(this));
}

Whiteboard.prototype = Object.create(Canvas.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.initialize = function() {
  var ctx = this.getContext('2d');

  ctx.fillStyle = "solid";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
};

Whiteboard.prototype.draw = function() {
  var ctx = this.getContext('2d');

  var method = _.first(arguments);
  var rest = _.rest(arguments);

  ctx[method] && ctx[method].apply(ctx, rest);
};

Whiteboard.prototype.loadPNG = function(buf) {
  var ctx = this.getContext('2d');
  var blob = new Blob([buf], {type: 'image/png'});
  var url = URL.createObjectURL(blob);
  var img = new Image();

  img.onload = function() {
    ctx.drawImage(this, 0, 0);
      URL.revokeObjectURL(url);
    }.bind(this);

    img.src = url;
};

module.exports = Whiteboard;
