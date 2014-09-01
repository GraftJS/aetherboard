/**
* Message Broker.
*
* Adapted from mcollina/mqbroker
*/
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

  function writeableFn(req, enc, done) {
    var msg = req.msg;

    if (!msg.topic) {
      return stream.emit('error', new Error('no topic specified'));
    }

    switch (msg.cmd) {
      case 'subscribe':
        readable.subscribe(msg.topic);
        that.emit('subscribe', msg, stream);
        break;
      case 'unsubscribe':
        readable.unsubscribe(msg.topic);
        that.emit('unsubscribe', msg, stream);
        break;
      case 'publish':
        this.push(msg);
        that.emit('publish', msg, stream);
        break;
    }

    done();
  }
};

module.exports = Broker;
