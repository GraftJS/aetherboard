// file: main entry point for webpack

// require the main.css
require('./main.css');

require('famous-polyfills');

// Copy the index.html to the output folder
require('./index.html');

var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var ImageSurface = require('famous/surfaces/ImageSurface');

// create the main context
var mainContext = Engine.createContext();

// your app here
var logo = new ImageSurface({
  size: [200, 200],
  content: 'https://rawgit.com/GraftJS/graft.io/master/static/images/graft-icon.png',
  classes: ['double-sided']
});

var initialTime = Date.now();
var centerSpinModifier = new Modifier({
  origin: [0.5, 0.5],
  transform : function(){
    return Transform.rotateY(0.002 * (Date.now() - initialTime));
  }
});

mainContext.add(centerSpinModifier).add(logo);
