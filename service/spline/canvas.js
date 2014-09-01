'use strict';

var slice = Array.prototype.slice;

module.exports = function() {
  var _operations = [];


  var recordOp = function(operation) {
    return function() {
      _operations.push([operation].concat(slice.call(arguments,0)));
    };
  };



  var operations = function operations() {
    return _operations;
  };



  return {
    beginPath: recordOp('beginPath'),
    moveTo: recordOp('moveTo'),
    lineTo: recordOp('lineTo'),
    stroke: recordOp('stroke'),
    arc: recordOp('arc'),
    operations: operations
  };
};

