/* eslint-disable linebreak-style */
const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.limitused = 0;

    // this.setEncoding(options.encoding);
  };

  _transform(chunk, encoding, callback) {
    this.limitused += chunk.length;
    // console.log(`limitused ${this.limitused} chunk ${chunk.toString()} chunk.length ${chunk.length}`);
    // console.log(chunk.byteLength, Buffer.from(chunk).length);
    if (this.limitused > this.limit) {
      // console.log('limit exceeded');
      callback(new LimitExceededError());
      return;
    }
    // console.log('next');
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
