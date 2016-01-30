'use strict';

/*
 * Evaluates a mathematical expression, passed in as a string.
 * Returns { error: string } if the expression cannot be evaluated.
 * Returns { result: number } otherwise.
 * At the moment, only supports expressions with the form "number + number =".
 */
module.exports = function evaluateExpression(expression) {
    if (typeof expression !== 'string') {
        return { error: 'expression must be a string' };
    }

    var errorMessage = 'expression must be of the form "x + y =", where x and y can be parsed as float numbers';
    var expressionRE = /^\s*(.+)\s*\+\s*(.+)\s*=\s*$/;

    var match = expression.match(expressionRE);
    if (! match) {
        return { error: errorMessage };
    }

    var left = parseFloat(match[1]);
    var right = parseFloat(match[2]);
    if (isNaN(left) || isNaN(right)) {
        return { error: errorMessage };
    }

    return { result: left + right };
};
