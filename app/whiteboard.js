var CanvasSurface = require('famous/surfaces/CanvasSurface');

function Whiteboard(options) {
    CanvasSurface.apply(this, arguments);

    var ctx = this.getContext('2d');
    ctx.fillStyle = "solid";
    ctx.strokeStyle = "#bada55";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    // simplest way i could think of.
    // go look here first :
    // http://famo.us/docs/0.2.0/inputs/GenericSync/
    // http://famo.us/docs/0.2.0/inputs/MouseSync
    this._eventOutput.on('mousedown', drawEvent.bind(this, 'start'));
    this._eventOutput.on('mousemove', drawEvent.bind(this, 'move'));
    this._eventOutput.on('mouseup', drawEvent.bind(this, 'end'));

    function drawEvent(type, evt) {
        this.draw(evt.offsetX, evt.offsetY, type);
    }
}

Whiteboard.prototype = Object.create(CanvasSurface.prototype);
Whiteboard.prototype.constructor = Whiteboard;

Whiteboard.prototype.draw = function(x, y, type) {
    var ctx = this.getContext('2d');
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
