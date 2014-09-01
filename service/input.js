var through = require('through2');

module.exports = function Input(emitter) {

  return through.obj(inputHandleFn);

  function inputHandleFn(chunk, enc, end) {
    this.push(chunk);
    end();
  }
};
