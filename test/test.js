/**
* Using .exist as a property instead of a function makes jshint unhappy!
*/
/*jshint -W030 */

var porti = require('../');
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

describe('Porti', () => {
  it('should get unused port without options', () => {
    return porti.getUnusedPort()
      .then((port) => expect(port).to.exist);
  });

  it('should get port in specified range', () => {
    let min = 5000;
    let max = 7000;

    return porti.getUnusedPort({ min, max })
      .then(port => {
        expect(port).to.be.at.least(min);
        expect(port).to.be.at.most(max);
      });
  });

  it('should throw error if no unused port found', () => {
    return porti.getUnusedPort({ min: -1, max: -1 })
      .catch(err => expect(err).to.exist);
  });
});
