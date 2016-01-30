'use strict';

var winston = require('winston');

var DEFAULT_PORT = 4321;

/*
 * Prints program usage.
 */
exports.printUsage = function() {
    console.log('Usage:');
    console.log('\t$ node evaluator [PORT] [LOG_FILE]');
    console.log('PORT: port number the server will listen on. Defaults to ' + DEFAULT_PORT + '.');
    console.log('LOG_FILE: path to the file where to save the logs. Defaults to stdout.');
    console.log('\nExample:');
    console.log('\t$ node evaluator');
};

/*
 * Parses the program options from the argv array.
 * Returns null if options cannot be parsed.
 * Returns a { port: int, logger: winston.Logger } object otherwise.
 */
exports.getOptions = function(argv) {
    var options = {
        port: DEFAULT_PORT,
        logger: new winston.Logger()
    };

    if (argv.length < 2 || argv.length > 4) {
        return null;
    }

    if (argv.length > 2) {
        options.port = parseInt(argv[2], 10);
        if (isNaN(options.port) || options.port > 65535 || options.port < 1) {
            return null;
        }
    }

    if (argv.length > 3) {
        options.logger.add(winston.transports.File, { filename: argv[3] });
    } else {
        options.logger.add(winston.transports.Console);
    }

    return options;
};
