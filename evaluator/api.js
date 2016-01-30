'use strict';

var url = require('url');
var evaluateExpression = require('./evaluate_expression');

function API(logger) {
    this.logger = logger;
}

API.prototype.logRequest = function (request, response, next) {
    this.logger.info('received request: ' + request.method + ' ' + request.url);
    next();
};

API.prototype.evaluate = function (request, response, next) {
    if (request.method !== 'GET') {
        next();
        return;
    }

    var parsedUrl = url.parse(request.url, true);
    var evaluatedExpression = evaluateExpression(parsedUrl.query.expression);

    if (evaluatedExpression.error) {
        this.logger.error(evaluatedExpression.error);

        response.statusCode = 400;
        response.end(evaluatedExpression.error);

        return;
    }

    var responseContent = JSON.stringify(evaluatedExpression);

    this.logger.info('sending response: ' + responseContent);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(responseContent);
};

/*
 * Takes a connect app and a logger, and adds handlers for the API
 * methods.
 */
exports.addAPIEndpoints = function (app, logger) {
    var api = new API(logger);

    // log all requests
    app.use(api.logRequest.bind(api));
    // the only method our API supports
    app.use('/evaluate', api.evaluate.bind(api));
};
