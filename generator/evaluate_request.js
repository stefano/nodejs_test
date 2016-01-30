'use strict';

var http = require('http');
var https = require('https');
var url = require('url');
var EventEmitter = require('events');
var util = require('util');

if (EventEmitter.EventEmitter) {
    // backward compatibility with old node versions
    EventEmitter = EventEmitter.EventEmitter;
}

/*
 * Sends the expression to evaluate to the specified evaluator server,
 * and logs the result.
 *
 * Emits 'error' and 'result' events.
 *
 * The actual request will be sent after calling run().
 */
function EvaluateRequest(evaluatorURL, expression, logger) {
    EventEmitter.call(this);

    this._endpoint = evaluatorURL;
    this._expression = expression;
    this._logger = logger;

    // always log errors and results
    this.on('error', this._onError.bind(this));
    this.on('result', this._onResult.bind(this));
}

util.inherits(EvaluateRequest, EventEmitter);

EvaluateRequest.prototype.run = function () {
    var requestURL = this._getURL();
    var self = this;

    this._onRequestStart(requestURL);

    this._getProtocol().get(requestURL, function (response) {
        response.on('error', function (error) {
            self.emit('error', 'error reading response: ' + error);
        });

        response.setEncoding('utf8');

        var body = [];
        response.on('data', function (chunk) {
            body.push(chunk);
        });

        response.on('end', function () {
            self._onResponse(body.join(''), response.statusCode);
        });
    }).on('error', function (error) {
        self.emit('error', 'error sending expression: ' + error);
    });
}

EvaluateRequest.prototype._getProtocol = function () {
    if (this._endpoint.protocol === 'https:') {
        return https;
    } else {
        return http;
    }
};

EvaluateRequest.prototype._getURL = function () {
    return url.format({
        protocol: this._endpoint.protocol || 'http:',
        host: this._endpoint.host,
        pathname: '/evaluate',
        query: { expression: this._expression }
    });
};

EvaluateRequest.prototype._onResponse = function (content, statusCode) {
    // first we need to make sure that the response has the correct
    // format

    if (statusCode !== 200) {
        this.emit('error', 'error evaluating expression: ' + content);
        return;
    }

    try {
        content = JSON.parse(content);
    } catch (e) {
        this.emit('error', 'evaluator response is not valid JSON: ' + content);
        return;
    }

    if (typeof content.result !== 'number') {
        this.emit('error', 'evaluator response is not well formed');
        return;
    }

    // all good, we can process the result now
    this.emit('result', content.result);
};

EvaluateRequest.prototype._onRequestStart = function (requestURL) {
    this._logger.info('sending request: ' + requestURL);
};

EvaluateRequest.prototype._onError = function (error) {
    this._logger.error(error);
};

EvaluateRequest.prototype._onResult = function (result) {
    this._logger.info('result: ' + this._expression + result);
};

module.exports = EvaluateRequest;
