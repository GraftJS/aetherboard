// file: main entry point for webpack

// require the main.css
require('./main.css');

require('famous-polyfills');

// Copy the index.html to the output folder
require('./index.html');

var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Whiteboard = require('./whiteboard');

// create the main context
var mainContext = Engine.createContext();

var rootModifier = new Modifier({
  //size: function() { mainContext.getSize(); },
 // origin: [0.5, 0.5]
});

var whiteboard = new Whiteboard({
  properties: { backgroundColor: 'lightgrey' }
});

mainContext.add(rootModifier).add(whiteboard);
