var Engine = require('famous/core/Engine');

var GenericSync = require("famous/inputs/GenericSync");
var MouseSync   = require("famous/inputs/MouseSync");
var TouchSync   = require("famous/inputs/TouchSync");
var ScrollSync  = require("famous/inputs/ScrollSync");

GenericSync.register({
  mouse : MouseSync,
  touch : TouchSync,
  scroll : ScrollSync
});

module.exports = function() {
  var genericSync = new GenericSync(['mouse', 'touch']);//, 'scroll']);
  Engine.pipe(genericSync);
  return genericSync;
};
