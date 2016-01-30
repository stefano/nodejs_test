'use strict';

function MockLogger() {
    this.logs = [];
}

MockLogger.prototype.info = function (value) {
    this.logs.push({ level: 'info', value: value });
};

MockLogger.prototype.error = function (value) {
    this.logs.push({ level: 'error', value: value });
};

module.exports = MockLogger;
