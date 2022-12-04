const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const MAX_LIMIT_SIZE = 1024 * 1024;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    // console.log('directory is not supported');
    res.statusCode = 400;
    return res.end('directory is not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    // console.log('file exists');
    res.statusCode = 409;
    return res.end('file exists');
  }

  const limitSizeStream = new LimitSizeStream({
    limit: MAX_LIMIT_SIZE,
    isObjectMode: req.isObjectMode
  });
  limitSizeStream.on('error', error => {
    // console.log('limit stream error', error);
    res.statusCode = 413;
    res.write('limit error');
  });

  const fileStream = fs.createWriteStream(filepath);

  switch (req.method) {
    case 'POST':
      // console.log('begin', filepath);

      pipeline(req, limitSizeStream, fileStream, (error) => {
        if (error) {
          // console.log(`pipeline error statusCode: ${res.statusCode}`, error);
          fileStream.close(() => {
            fs.rmSync(filepath);
            // console.log(`${filepath} deleted`);
          });
        } else {
          res.statusCode = 201;
          res.write('done');
        }
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

// server.on('clientError', (err, socket) => {
//   console.log('clientError error', err);
// });

// server.on('error', error => {
//   console.log('server error', error);
// });

module.exports = server;
