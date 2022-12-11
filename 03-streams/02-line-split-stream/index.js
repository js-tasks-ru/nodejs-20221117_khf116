const fs = require('fs');
const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lsStream = new LineSplitStream({encoding: 'utf-8'});

lsStream.on('data', (chunk) => {
  console.log('on data', chunk);
});

lsStream.write(`a${os.EOL}b`);
