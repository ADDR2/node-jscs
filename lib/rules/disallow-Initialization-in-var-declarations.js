var assert = require('assert');

function InitDetected(declarations){
    for (var i = 0; i < declarations.length; i++){
        if (declarations[i].init)
            return true;
    }
    return false;
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(disallowInitializationInVarDeclarations) {
        assert(
            disallowInitializationInVarDeclarations === true,
            'disallowInitializationInVarDeclarations option requires a value of true or should be removed.'
        );
    },

    getOptionName: function() {
        return 'disallowInitializationInVarDeclarations';
    },

    check: function(file, errors) {

        file.iterateNodesByType('VariableDeclaration', function(node) {
            if (node.declarations.length > 1 && InitDetected(node.declarations))
                errors.add('Initialization is forbidden in var declarations.', node.loc.start);
        });

    }
};