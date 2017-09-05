'use strict';

const net = require('net');
const deasync = require('deasync');

const DEFAULT_MIN_PORT = 1024;

const getUnusedPort = exports.getUnusedPort = function (options) {
  options = options || {};

  let min = options.min || DEFAULT_MIN_PORT;
  let port = options.port || min;
  let max = options.max;

  let promise = new Promise((resolve, reject) => {
    let server = net.createServer();

    if (port >= max) {
      let error = new Error('Could not find an unused port');
      error.code = 'NO_UNUSED';
      return reject(error);
    }

    server.listen(port, (err) => {
      if (err) {
        return reject(err);
      }

      server.once('close', () => resolve(port));
      server.close();
    });

    server.on('error', reject);
  });

  return promise.catch((err) => {
    if (err.code === 'NO_UNUSED') throw err;
    return getUnusedPort({ min, max, port: ++port });
  });
};

exports.getUnusedPortSync = function (options) {
  let done = false;
  let port;
  let err;

  getUnusedPort(options)
    .then((_port) => {
      done = true;
      port = _port;
    })
    .catch((_err) => {
      done = true;
      err = _err;
    });

  deasync.loopWhile(() => !done);

  if (err) throw err;
  return port;
};
