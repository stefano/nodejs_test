'use strict';

var http = require('http');
var connect = require('connect');
var options = require('./options');
var api = require('./api');

var appOptions = options.getOptions(process.argv);
if (! appOptions) {
    options.printUsage();
    process.exit(1);
}

var app = connect();
api.addAPIEndpoints(app, appOptions.logger);
http.createServer(app).listen(appOptions.port);

appOptions.logger.info('server started on port ' + appOptions.port);
