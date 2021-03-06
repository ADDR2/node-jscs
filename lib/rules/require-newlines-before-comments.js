var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireNewLinesBeforeComments) {
        assert(
            typeof requireNewLinesBeforeComments === 'boolean',
            'requireNewLinesBeforeComments option requires boolean value'
        );
        assert(
            requireNewLinesBeforeComments === true,
            'requireNewLinesBeforeComments option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireNewLinesBeforeComments';
    },

    check: function(file, errors) {
        file.iterateNodesByType('BlockStatement', function(node) {
            var tokens = file.getTokens();

            var openingBracePos = file.getTokenPosByRangeStart(node.range[0]);
            var openingBrace = tokens[openingBracePos];
            var prevToken = tokens[openingBracePos - 1];

            if (openingBrace.loc.start.line === prevToken.loc.start.line) {
                errors.add(
                    'Missing newline before curly brace for block statement',
                    node.loc.start
                );
            }
        });
    }
};
