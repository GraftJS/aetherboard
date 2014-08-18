// file: main entry point for webpack

// require the main.css
require('./main.css');

require('famous-polyfills');

// Copy the index.html to the output folder
require('./index.html');

var Engine = require('famous/core/Engine');
var Interface = require('./interface');

// create the main context
var mainContext = Engine.createContext();

var interface = new Interface({
  context: mainContext
});

mainContext.add(interface);
