const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.remainder = '';
  }

  _transform(chunk, encoding, callback) {
    const str = this.remainder + chunk.toString();

    let line = '';
    for (const character of str.split('')) {
      if (character === os.EOL) {
        this.push(line);
        line = '';
        continue;
      }

      line += character;
    }
    this.remainder = line;

    callback();
  }

  _flush(callback) {
    if (this.remainder) {
      this.push(this.remainder);
    }

    callback();
  }
}

module.exports = LineSplitStream;
