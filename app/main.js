// file: main entry point for webpack

// require the main.css
require('./main.css');

require('famous-polyfills');

// Copy the index.html to the output folder
require('./index.html');

var Engine = require('famous/core/Engine');
var Modifier   = require('famous/core/Modifier');
var Whiteboard = require('./whiteboard');

var sync = require('./sync');
var input = require('../service/input');
var prop = require('../service/property');
var invoke = require('../service/invoke');
var spline = require('../service/spline');

var through = require('through2');

// create the main context
var mainContext = Engine.createContext();

// initializa basic components
var whiteboard = new Whiteboard();
var modifier = new Modifier({
  size: [500, 500],
  origin: [0.5, 0.5]
});


console.log(whiteboard.ctx);
// stream input through spline onto canvas
input(sync)
  .pipe(prop('segments'))
  .pipe(spline())
  .pipe(invoke(whiteboard.ctx));

// add the modifier and then the surface to the tree.
mainContext 
  .add(modifier)
  .add(whiteboard);
