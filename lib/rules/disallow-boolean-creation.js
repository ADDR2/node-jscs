var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(disallowBooleanCreation) {
        assert(
            disallowBooleanCreation === true,
            'disallowBooleanCreation option requires a value of true or should be removed.'
        );
    },

    getOptionName: function() {
        return 'disallowBooleanCreation';
    },

    check: function(file, errors) {

        file.getLines().forEach(function(line, i) {
            var index = line.search(/new[\s\t]+Boolean()/);
            if (index > -1) {
                errors.add(
                    'There is no need to use new in this statement.',
                    i + 1, index
                );
            }
        });

    }
};