'use strict';

var chai = require('chai');
var http = require('http');
var MockLogger = require('./mock_logger');
var EvaluateRequest = require('../generator/evaluate_request');

function MockServer() {
    var self = this;

    this.lastRequest = null;
    this.responseStatus = 200;
    this.response = '';

    this.server = http.createServer(function (request, response) {
        self.lastRequest = request;
        response.statusCode = self.responseStatus;
        response.end(self.response);
    });
    this.server.listen(4321);
}

describe('generator request', function () {
    beforeEach(function (done) {
        this.logger = new MockLogger();
        this.request = new EvaluateRequest({ host: 'localhost:4321' }, '1+2=', this.logger);
        this.requestLog = {
            level: 'info',
            value: 'sending request: http://localhost:4321/evaluate?expression=1%2B2%3D'
        };

        this.mockServer = new MockServer();
        this.mockServer.server.on('listening', function () { done(); });
    });

    afterEach(function () {
        this.mockServer.server.close();
    });

    it('evaluate', function (done) {
        var self = this;

        this.mockServer.response = '{"result":77}';

        this.request.on('result', function (result) {
            chai.expect(self.mockServer.lastRequest.url).to.be.equal('/evaluate?expression=1%2B2%3D');
            chai.expect(self.mockServer.lastRequest.method).to.be.equal('GET');
            chai.expect(result).to.be.equal(77);
            chai.expect(self.logger.logs).to.be.deep.equal([
                self.requestLog,
                {
                    level: 'info',
                    value: 'result: 1+2=77'
                }
            ]);
            done();
        });
        this.request.run();
    });

    it('handle bad request error', function (done) {
        var self = this;

        this.mockServer.responseStatus = 400;
        this.mockServer.response = 'i am an error';

        this.request.on('error', function (error) {
            chai.expect(error).to.be.equal('error evaluating expression: i am an error');
            chai.expect(self.logger.logs).to.be.deep.equal([
                self.requestLog,
                {
                    level: 'error',
                    value: 'error evaluating expression: i am an error'
                }
            ]);
            done();
        });
        this.request.run();
    });

    it('handle invalid response json', function (done) {
        var self = this;

        this.mockServer.response = 'i am not json';

        this.request.on('error', function (error) {
            chai.expect(error).to.be.equal('evaluator response is not valid JSON: i am not json');
            chai.expect(self.logger.logs).to.be.deep.equal([
                self.requestLog,
                {
                    level: 'error',
                    value: 'evaluator response is not valid JSON: i am not json'
                }
            ]);
            done();
        });
        this.request.run();
    });

    it('handle json with bad result type', function (done) {
        var self = this;

        this.mockServer.response = '{"result": "i am a string"}';

        this.request.on('error', function (error) {
            chai.expect(error).to.be.equal('evaluator response is not well formed');
            chai.expect(self.logger.logs).to.be.deep.equal([
                self.requestLog,
                {
                    level: 'error',
                    value: 'evaluator response is not well formed'
                }
            ]);
            done();
        });
        this.request.run();
    });
});
