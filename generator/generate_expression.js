'use strict';

/*
 * Generates a random addition expression.
 * The numbers will be between -1000 (inclusive) and 1000 (exclusive).
 * The expression is returned as a string.
 */
module.exports = function generateExpression() {
    return randomNumber() + '+' + randomNumber() + '=';
};

function randomNumber() {
    var min = -1000;
    var max = 1000;

    return Math.random() * (max - min) + min;
};
