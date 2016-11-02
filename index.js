const net = require('net');

const getUnusedPort = exports.getUnusedPort = (options) => {
  return new Promise((resolve, reject) => {
    options = options || {};

    let min = options.min || 1024;
    let max = options.max;
    let port = options.port || min;

    let server = net.createServer();

    if (port >= max) {
      return reject('Could not find an unused port');
    }

    server.listen(port, (err) => {
      server.once('close', () => resolve(port));
      server.close();
    });

    server.on('error', () => getUnusedPort({ min, max, port: ++port }));
  });
};
