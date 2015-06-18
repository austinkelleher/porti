var porti = require('../');
var chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

describe('Porti', function() {

    describe('Getting unused port', function() {
        it('should get unused port with min, max options', function(done) {
            porti.getUnusedPort({
                min: 2000,
                max: 5000
            }, function(err, port) {
                expect(err).to.not.exist;
                expect(port).to.be.at.most(5000);
                expect(port).to.be.above(2000);
                done();
            });
        });

        it('should allow setting an environment variable', function(done) {
            porti.getUnusedPort({
                env: 'PORTI_PORT'
            }, function(err, port) {
                expect(process.env['PORTI_PORT']).to.equal(port.toString());
                done();
            });
        });
    });

    describe('Getting port data', function() {
        it('should deliver port data on port in use', function(done) {
            porti.getUnusedPort({}, function(err, port) {
                //Dummy server
                require('net').createServer(function (socket) {
                }).listen(port);

                porti.getPortData(port, function(err, data) {
                    expect(data.command).to.equal('node');
                    done();
                });
            });
        });
    });
});
