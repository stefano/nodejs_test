'use strict';

var options = require('./options');
var generateExpression = require('./generate_expression');
var EvaluateRequest = require('./evaluate_request');

var appOptions = options.getOptions(process.argv);
if (! appOptions) {
    options.printUsage();
    process.exit(1);
}

function main() {
    var request = new EvaluateRequest(
        appOptions.evaluatorURL,
        generateExpression(),
        appOptions.logger);

    request.run();
}

setInterval(main, appOptions.interval);
