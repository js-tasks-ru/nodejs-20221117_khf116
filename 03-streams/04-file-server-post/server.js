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

  if (req.method !== 'POST') {
    res.statusCode = 501;
    res.end('Not implemented');
  }

  if (pathname.indexOf('/') >= 0) {
    // console.log('directory is not supported');
    res.statusCode = 400;
    return res.end('directory is not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  // if (fs.existsSync(filepath)) {
  //   // console.log('file exists');
  //   res.statusCode = 409;
  //   return res.end('file exists');
  // }

  fs.stat(filepath, (err, stats) => {
    if (err && err.code !== 'ENOENT') {
      // console.log(err);
      res.statusCode = 500;
      return res.end('some error');
    }

    if (stats) {
      // console.log('file exists');
      res.statusCode = 409;
      return res.end('file exists');
    }

    setTimeout(() => {
      // writeFile(req, res, filepath);
      writeFile2(req, res, filepath); // отдельная функция только для того, чтобы прошел тест на 'при попытке создания слишком большого файла - ошибка 413'
    }, 0);

  });
});

function writeFile(req, res, filepath) {
  const limitSizeStream = new LimitSizeStream({
    limit: MAX_LIMIT_SIZE,
    isObjectMode: req.isObjectMode
  });

  const fileStream = fs.createWriteStream(filepath);

  pipeline(req, limitSizeStream, fileStream, (error) => {
    if (error) {
      if (error.code === 'LIMIT_EXCEEDED')
        res.statusCode = 413;
      else
        res.statusCode = 500;
      res.end('error');

      console.log(`pipeline error statusCode: ${res.statusCode}`, error);

      setTimeout(() => {
        fileStream.close(() => {
          fs.unlink(filepath, (err) => {
            if (err)
              console.log(`delete error ${filepath}`);
            else
              console.log(`deleted ${filepath}`);
          });
        });
      }, 0);
    } else {
      res.statusCode = 201;
      res.end('done');
    }
  });
}

function writeFile2(req, res, filepath) {
  function deleteFile(filepath) {
    fileStream.destroy();
    fs.unlinkSync(filepath);
  };

  const limitSizeStream = new LimitSizeStream({
    limit: MAX_LIMIT_SIZE,
    isObjectMode: req.isObjectMode
  });

  const fileStream = fs.createWriteStream(filepath);

  req.on('end', () => {
    console.log('req end');
    if (res.statusCode === 200)
      res.statusCode = 201;
    res.end();
  });

  limitSizeStream.on('error', (error) => {
    res.statusCode = 413;
    deleteFile(filepath);
    req.resume(); // игнорирую ошибку, вызываю событие end, без этого тест не проходит
  });

  req.on('error', (error) => {
    // console.log('req error', error);
    deleteFile(filepath);
    if (res.statusCode === 200)
      res.statusCode = 500;
    res.end();
  });

  req.pipe(limitSizeStream).pipe(fileStream);
}

module.exports = server;
