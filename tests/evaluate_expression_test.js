'use strict';

var chai = require('chai');
var evaluateExpression = require('../evaluator/evaluate_expression');

describe('evaluateExpression', function () {
    it('bad argument type', function () {
        chai.expect(evaluateExpression(undefined)).to.be.deep.equal({
            error: 'expression must be a string'
        });
        chai.expect(evaluateExpression(100)).to.be.deep.equal({
            error: 'expression must be a string'
        });
    });

    it('malformed string', function () {
        chai.expect(evaluateExpression('test test')).to.be.deep.equal({
            error: 'expression must be of the form "x + y =", where x and y can be parsed as float numbers'
        });
    });

    it('sum of non-numbers', function () {
        chai.expect(evaluateExpression('x+y=')).to.be.deep.equal({
            error: 'expression must be of the form "x + y =", where x and y can be parsed as float numbers'
        });
    });

    it('sum of numbers', function () {
        chai.expect(evaluateExpression('12+55=')).to.be.deep.equal({
            result: 67
        });
    });

    it('ignore spaces', function () {
        chai.expect(evaluateExpression(' \t 12\t +    55   \t=   \t')).to.be.deep.equal({
            result: 67
        });
    });
});
