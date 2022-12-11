const fs = require('fs');

module.exports = function sendFile(filepath, res, req) {
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);

  fileStream
      .on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        console.error(err);
        res.statusCode = 500;
        res.end('Internal error');
      });

  req.on('aborted', () => {
    fileStream.destroy();
  });
};
