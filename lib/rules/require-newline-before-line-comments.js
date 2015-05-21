var assert = require('assert');

module.exports = function() {};

function notEmpty(line){
    var notempty = /[^\s\t]/;
    return notempty.test(line);
}

module.exports.prototype = {
    configure: function(requireNewLineBeforeLineComments) {
        assert(
            requireNewLineBeforeLineComments === true,
            'requireNewLineBeforeLineComments option requires a value of true or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireNewLineBeforeLineComments';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        var something = /[^\s\t]/i;
        var comments = file.getComments();
        for (var i = 0; i < comments.length; i++){
            if (comments[i].type == 'Line') {
                for (var j = 0; j < lines.length; j++){
                    var commentFound = lines[j].search('/'+'/'+comments[i].value);
                    if (commentFound > -1 && (j <= 0 || (j > 0 && notEmpty(lines[j-1])) || lines[j].search(something) < commentFound)){
                        errors.add(
                        'A new line should be on top of a line comment',
                        comments[i].loc.start
                        );
                    }
                }
            }
        }

    }
};