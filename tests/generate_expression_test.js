'use strict';

var chai = require('chai');
var generateExpression = require('../generator/generate_expression');
var evaluateExpression = require('../evaluator/evaluate_expression');

describe('generateExpression', function () {
    it('generates an expression that can be evaluated', function () {
        var res = evaluateExpression(generateExpression());

        chai.expect(typeof res.result).to.be.equal('number');
    });
});
