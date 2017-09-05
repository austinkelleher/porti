'use strict';

const porti = require('../');
const chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
const expect = require('chai').expect;
const net = require('net');

function _startServerOnPort (port) {
  let server = net.createServer();
  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      return err ? reject(err) : resolve(server);
    });

    server.on('error', reject);
  });
}

function _closeServer (server) {
  return new Promise((resolve, reject) => {
    server.once('close', resolve);
    server.on('error', reject);
    server.close();
  });
}

describe('Porti Sync', () => {
  let dummyServers;

  beforeEach(() => {
    return Promise.all([
      _startServerOnPort(5000),
      _startServerOnPort(5001)
    ]).then((servers) => {
      dummyServers = servers;
    });
  });

  afterEach(() => {
    let promises = [];

    dummyServers.forEach((server) => {
      promises.push(_closeServer(server));
    });

    return Promise.all(promises);
  });

  it('should get unused port without options', () => {
    const port = porti.getUnusedPortSync();
    expect(port).to.exist;
  });

  it('should get port in specified range', () => {
    let min = 5000;
    let max = 7000;

    const port = porti.getUnusedPortSync({ min, max });
    expect(port).to.be.at.least(min);
    expect(port).to.be.at.most(max);
  });

  it('should throw error if no unused port found', () => {
    expect(() => {
      porti.getUnusedPortSync({ min: -1, max: -1 });
    }).to.throw('Could not find an unused port');
  });

  it('should continue to find an unused port if ports are in use', () => {
    const port = porti.getUnusedPortSync({
      min: 5000
    });
    expect(port).to.equal(5002);
  });
});
