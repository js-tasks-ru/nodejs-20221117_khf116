const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options?.encoding;
    this.separator = os.EOL;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    var rest = '';
    var chunkString = chunk.toString();

    if (chunkString.indexOf(this.separator) < 0) {
      // нет разделителя, добавляю строку в буфер
      this.buffer += chunkString;
      callback();
      return;
    }

    // если разделитель не последний символ, то весь блок от разделителя до конца строки помещаю в остаток строки
    var lastPosSep = chunkString.lastIndexOf(this.separator);
    if (lastPosSep + 1 !== chunkString) {
      rest = chunkString.substr(lastPosSep).split(this.separator)[1];
      chunkString = chunkString.substr(0, lastPosSep);
    }

    var array = chunkString.split(this.separator);
    array.forEach(element => {
      var data = '';
      if (this.buffer.length > 0) {
        data = this.buffer;
        this.buffer = '';
      }
      data += element;

      this.push(data);
    });

    callback();

    if (rest.length) {
      this.buffer = rest;
    }
  }

  _flush(callback) {
    if (this.buffer.length > 0)
      callback(null, this.buffer);
    else
      callback();
  }
}

module.exports = LineSplitStream;
