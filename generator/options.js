'use strict';

var winston = require('winston');
var url = require('url');

var DEFAULT_INTERVAL = 100;

/*
 * Prints program usage.
 */
exports.printUsage = function() {
    console.log('Usage:');
    console.log('\t$ node generator EVALUATOR_URL [INTERVAL] [LOG_FILE]\n');
    console.log('EVALUATOR_URL: URL of the evaluator server. The path component should not be specified.');
    console.log('INTERVAL: interval, in milliseconds, to wait between generated expressions. Must be a positive integer. Defaults to ' + DEFAULT_INTERVAL + 'ms.');
    console.log('LOG_FILE: path to the file where to save the logs. Defaults to stdout.');
    console.log('\nExample:');
    console.log('\t$ node generator http://localhost:4321');
};

/*
 * Parses the program options from the argv array.
 * Returns null if options cannot be parsed.
 * Returns a { evaluatorURL: URL, logger: winston.Logger, interval: number } object otherwise.
 */
exports.getOptions = function(argv) {
    var options = {
        evaluatorURL: null,
        logger: new winston.Logger(),
        interval: DEFAULT_INTERVAL
    };

    if (argv.length < 3 || argv.length > 5) {
        return null;
    }

    options.evaluatorURL = url.parse(argv[2]);
    if (! options.evaluatorURL.host) {
        return null;
    }

    if (argv.length > 3) {
        options.interval = parseInt(argv[3], 10);
        if (isNaN(options.interval) || options.interval <= 0) {
            return null;
        }
    }

    if (argv.length > 4) {
        options.logger.add(winston.transports.File, { filename: argv[4] });
    } else {
        options.logger.add(winston.transports.Console);
    }

    return options;
};
