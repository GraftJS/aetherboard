var Engine     = require('famous/core/Engine');
var View       = require('famous/core/View');
var Surface    = require('famous/core/Surface');
var Modifier   = require('famous/core/Modifier');
var Transform  = require('famous/core/Transform');
var Whiteboard = require('./whiteboard');

function Interface(options) {
  View.apply(this, arguments);

  this.context = options.context;


}

Interface.prototype = Object.create(View.prototype);
Interface.prototype.constructor = Interface;

module.exports = Interface;
