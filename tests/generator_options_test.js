'use strict';

var chai = require('chai');
var options = require('../generator/options');

describe('evaluator options', function () {
    it('default interval and logger', function () {
        var opts = options.getOptions(['', '', 'http://localhost:4321']);

        chai.expect(opts.evaluatorURL.host).to.be.equal('localhost:4321');
        chai.expect(opts.interval).to.be.equal(100);
        chai.expect(opts.logger).to.be.defined;
    });

    it('custom interval and logger', function () {
        var opts = options.getOptions(['', '', 'http://localhost:4322', '200', '/tmp/a']);

        chai.expect(opts.evaluatorURL.host).to.be.equal('localhost:4322');
        chai.expect(opts.interval).to.be.equal(200);
        chai.expect(opts.logger).to.be.defined;
    });

    it('bad url', function () {
        var opts = options.getOptions(['', '', 'test test']);

        chai.expect(opts).to.be.null;
    });

    it('bad interval', function () {
        var opts = options.getOptions(['', '', 'http://localhost:4321', '-1']);
        chai.expect(opts).to.be.null;

        opts = options.getOptions(['', '', 'http://localhost:4321', 'abc']);
        chai.expect(opts).to.be.null;
    });

    it('too many arguments', function () {
        var opts = options.getOptions(['', '', 'http://localhost:4321', '200', '/tmp/a', '']);

        chai.expect(opts).to.be.null;
    });

    it('too few arguments', function () {
        var opts = options.getOptions(['', '']);

        chai.expect(opts).to.be.null;
    });
});
