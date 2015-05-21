var assert = require('assert');

function areInTheSameLine(declarations){
    for (var i = 0; i < declarations.length-1; i++){
        if (declarations[i].loc.start.line == declarations[i+1].loc.start.line)
            return true;
    }
    return false;
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireMultipleLineInVarDeclaration) {
        assert(
            requireMultipleLineInVarDeclaration === true,
            'requireMultipleLineInVarDeclaration option requires a value of true or should be removed.'
        );
    },

    getOptionName: function() {
        return 'requireMultipleLineInVarDeclaration';
    },

    check: function(file, errors) {

        file.iterateNodesByType('VariableDeclaration', function(node) {
            if (node.declarations.length > 1 && areInTheSameLine(node.declarations))
                errors.add('Each var should be in a different line.', node.loc.start);
        });

    }
};