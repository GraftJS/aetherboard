var Engine     = require('famous/core/Engine');
var View       = require('famous/core/View');
var Surface    = require('famous/core/Surface');
var Modifier   = require('famous/core/Modifier');
var Transform  = require('famous/core/Transform');
var Whiteboard = require('./whiteboard');

function Interface(options) {
  View.apply(this, arguments);

  this.context = options.context;

  this.addRoot();
  this.addInputLayer();
  this.addWhiteboard();
  this.registerEvents();

}

Interface.prototype = Object.create(View.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.registerEvents = function() {
  this._eventInput.on('mousedown', drawEvent.bind(this, 'start'));
  this._eventInput.on('mousemove', drawEvent.bind(this, 'move'));
  this._eventInput.on('mouseup', drawEvent.bind(this, 'end'));

  function drawEvent(type, evt) {
    this.whiteboard.surface.draw(evt.offsetX, evt.offsetY, type);
  }
};


/**
* Add a root modifier that all other nodes are attached to.
*/
Interface.prototype.addRoot = function() {
  this.modifier = new Modifier();
  this.root = this.add(this.modifier);
};

/**
* Place a layer above the entire ui to catch all pointer events.
*/
Interface.prototype.addInputLayer = function() {

  // initializa basic components
  this.inputLayer = {
    surface: new Surface(),
    modifier: new Modifier()
  };

  // place the input capture layer way above the whiteboard layer.
  this.inputLayer.modifier
    .transformFrom(Transform.translate(0, 0, 10000));

  // all input events from the surface will be sent to the view
  this.subscribe(this.inputLayer.surface);

  // add the modifier and then the surface to the tree.
  this.root
    .add(this.inputLayer.modifier)
    .add(this.inputLayer.surface);
};

/**
* Place a layer above the entire ui to catch all pointer events.
*/
Interface.prototype.addWhiteboard = function() {

  // initializa basic components
  this.whiteboard = {
    surface: new Whiteboard(),
    modifier: new Modifier()
  };

  // pipe all events from the surface to this view.
  this.subscribe(this.whiteboard.surface);

  // add the modifier and then the surface to the tree.
  this.root
    .add(this.whiteboard.modifier)
    .add(this.whiteboard.surface);
};

module.exports = Interface;
