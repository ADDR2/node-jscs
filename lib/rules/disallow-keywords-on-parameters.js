var assert = require('assert');
var keywords = [];

module.exports = function() {};

module.exports.prototype = {

    configure: function(parameters) {
        assert(
            Array.isArray(parameters),
            'disallowKeywordsOnParameters option requires array.'
        );

        keywords = parameters;
    },

    getOptionName: function() {
        return 'disallowKeywordsOnParameters';
    },

    check: function(file, errors) {

        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {

            node.params.forEach(function(param) {
                for (var i = 0; i < keywords.length; i++){
                    if (param.name == keywords[i]){
                        errors.add(
                            param.name + ' keyword is forbidden',
                            param.loc.start
                        );
                    }
                }
                
            });
        });
    }

};
