var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowEqualAndNotEqualOperators) {
        assert(
            disallowEqualAndNotEqualOperators === true,
            'disallowEqualAndNotEqualOperators option requires a value of true or should be removed.'
        );

    },

    getOptionName: function() {
        return 'disallowEqualAndNotEqualOperators';
    },

    check: function(file, errors) {

        file.getLines().forEach(function(line, i) {
            var equal = -2;
            var notequal = -2;
            var next = line;
            while (equal < line.length && equal != -1){
                next = line.substr(equal+2+(line.length-next.length));
                equal = next.search('==');
                if (equal > -1 && next.search('===') != equal && (next.search('!==') == -1 || (next.search('!==') > -1 && next.search('!==') + 1 != equal))){
                    errors.add(
                        '== operator is forbidden, === operator should be used instead.',
                        i + 1, equal+(line.length-next.length)
                    );
                }
            }
            next = line;
            while (notequal < line.length && notequal != -1){
                next = line.substr(notequal+2+(line.length-next.length));
                notequal = next.search('!=');
                if (notequal > -1 && next.search('!==') != notequal){
                    errors.add(
                        '!= operator is forbidden, !== operator should be used instead.',
                        i + 1, notequal+(line.length-next.length)
                    );
                }
            }

        });
    }

};