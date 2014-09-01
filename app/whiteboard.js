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

module.exports = Whiteboard;
