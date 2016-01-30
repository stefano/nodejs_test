'use strict';

var chai = require('chai');
var connect = require('connect');
var http = require('http');
var api = require('../evaluator/api');
var MockLogger = require('./mock_logger');

describe('evaluator api', function () {
    function request(params, success) {
        http.get('http://localhost:4321/evaluate?' + params, function (response) {
            var body = [];

            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                body.push(chunk);
            });
            response.on('end', function () {
                success(response, body.join(''));
            });
        });
    }

    beforeEach(function (done) {
        this.logger = new MockLogger();

        var app = connect();
        api.addAPIEndpoints(app, this.logger);

        this.server = http.createServer(app);

        this.server.listen(4321);
        this.server.on('listening', function () { done(); });
    });

    afterEach(function () {
        this.server.close();
    });

    it('evaluate expression', function (done) {
        var logs = this.logger.logs;

        request('expression=' + encodeURIComponent('1+2='), function (response, body) {
            chai.expect(response.statusCode).to.be.equal(200);
            chai.expect(JSON.parse(body).result).to.be.equal(3);

            chai.expect(logs).to.be.deep.equal([
                {
                    level: 'info',
                    value: 'received request: GET /evaluate?expression=1%2B2%3D'
                },
                {
                    level: 'info',
                    value: 'sending response: {"result":3}'
                }
            ]);

            done();
        });
    });

    it('missing expression', function (done) {
        var logs = this.logger.logs;

        request('', function (response, body) {
            chai.expect(response.statusCode).to.be.equal(400);
            chai.expect(body).to.be.equal('expression must be a string');

            chai.expect(logs).to.be.deep.equal([
                {
                    level: 'info',
                    value: 'received request: GET /evaluate?'
                },
                {
                    level: 'error',
                    value: 'expression must be a string'
                }
            ]);

            done();
        });
    });

    it('bad expression', function (done) {
        var logs = this.logger.logs;

        request('expression=oops', function (response, body) {
            chai.expect(response.statusCode).to.be.equal(400);
            chai.expect(body).to.be.equal('expression must be of the form "x + y =", where x and y can be parsed as float numbers');

            chai.expect(logs).to.be.deep.equal([
                {
                    level: 'info',
                    value: 'received request: GET /evaluate?expression=oops'
                },
                {
                    level: 'error',
                    value: 'expression must be of the form "x + y =", where x and y can be parsed as float numbers'
                }
            ]);

            done();
        });
    });
});
