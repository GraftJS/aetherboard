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

Whiteboard.prototype.draw = function(x, y, type) {
  var ctx = this.ctx;
  if (type === "start") {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (type === "move") {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.closePath();
  }
};

module.exports = Whiteboard;
