const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') >= 0) {
    res.statusCode = 400;
    return res.end('directory is not support');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    return res.end('file not exists');
  }

  const stream = fs.createReadStream(filepath);
  stream.on('error', error => {
    // console.log('file stream error', error);
    res.statusCode = 500;
    res.write('file stream error');
  });

  switch (req.method) {
    case 'GET':
      // console.log(filepath);

      // stream.pipe(res);
      pipeline(stream, res, (error) => {
        if (error) {
          // console.log('pipeline error', error);
          res.write('pipeline error');
        }
        res.end();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

// server.on('error', error => {
//   console.log('server error', error);
// });

module.exports = server;
