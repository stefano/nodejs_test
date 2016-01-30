'use strict';

var chai = require('chai');
var options = require('../evaluator/options');

describe('evaluator options', function () {
    it('default port and logger', function () {
        var opts = options.getOptions(['', '']);

        chai.expect(opts.port).to.be.equal(4321);
        chai.expect(opts.logger).to.be.defined;
    });

    it('custom port and logger', function () {
        var opts = options.getOptions(['', '', '5000', '/tmp/a']);

        chai.expect(opts.port).to.be.equal(5000);
        chai.expect(opts.logger).to.be.defined;
    });

    it('bad port number', function () {
        var opts = options.getOptions(['', '', 'test', '/tmp/a']);

        chai.expect(opts).to.be.null;
    });

    it('too many arguments', function () {
        var opts = options.getOptions(['', '', '5000', '/tmp/a', '']);

        chai.expect(opts).to.be.null;
    });

    it('too few arguments', function () {
        var opts = options.getOptions(['']);

        chai.expect(opts).to.be.null;
    });
});
