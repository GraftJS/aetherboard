var CanvasSurface = require('famous/surfaces/CanvasSurface');

function Whiteboard(options) {
  CanvasSurface.apply(this, arguments);

  this.ctx = this.getContext('2d');

  this.ctx.fillStyle = "solid";
  this.ctx.strokeStyle = "#000000";
  this.ctx.lineWidth = 5;
  this.ctx.lineCap = "round";
}

Whiteboard.prototype = Object.create(CanvasSurface.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.loadPNG = function(buf) {
    var ctx = this.ctx;
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
