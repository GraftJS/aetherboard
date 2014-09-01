var mqstreams = require('mqstreams');
var duplexer  = require('reduplexer');
var through   = require('through2');
var inherits  = require('inherits');
var events    = require('events');
var mqemitter = require('mqemitter');

function Broker(mq) {
  if (!(this instanceof Broker)) {
    return new Broker(mq);
  }

  if (!mq) {
    mq = mqemitter();
  }

  this._mq = mqstreams(mq);
}

inherits(Broker, events.EventEmitter);

Broker.prototype.stream = function() {
  var that = this;

  var readable = this._mq.readable();
  var writable = through.obj({highWaterMark: 1}, writeableFn);

  writable.pipe(this._mq.writable());

  var stream = duplexer(writable, readable, { objectMode: true, highWaterMark: 1 });

  return stream;

  function writeableFn(chunk, enc, done) {

    if (!chunk.topic) {
      return stream.emit('error', new Error('no topic specified'));
    }

    switch (chunk.cmd) {
      case 'subscribe':
        readable.subscribe(chunk.topic);
        that.emit('subscribe', chunk, stream);
        break;
      case 'unsubscribe':
        readable.unsubscribe(chunk.topic);
        that.emit('unsubscribe', chunk, stream);
        break;
      case 'publish':
        this.push(chunk);
        that.emit('publish', chunk, stream);
        break;
    }

    done();
  }
};

module.exports = Broker;
