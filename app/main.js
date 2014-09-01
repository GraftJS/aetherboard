// file: main entry point for webpack

// require the main.css
require('./main.css');

require('famous-polyfills');

// Copy the index.html to the output folder
require('./index.html');

var Engine = require('famous/core/Engine');

var Interface = require('./interface');
var sync = require('./sync');
var input = require('../service/input');

var through = require('through2');

input(sync).pipe(through.obj(function(chunk, enc, done) {
  chunk.segments.pipe(through.obj(log));
  done();
}));

function log(chunk, enc, done) {
  console.log(chunk);
  done();
}

// create the main context
var mainContext = Engine.createContext();

var interface = new Interface({
  context: mainContext
});

mainContext.add(interface);
