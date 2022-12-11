const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    res.statusCode = 400;
    return res.end('directory is not support');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  console.log(filepath);

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    return res.end('file not exists');
  }

  switch (req.method) {
    case 'DELETE':

      fs.rmSync(filepath);
      res.statusCode = 200;
      res.end('deleted');

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
