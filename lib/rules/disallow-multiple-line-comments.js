var assert = require('assert');

module.exports = function() {};

function NoSapcesBefore(line){
    var k = 0;
    var nline = '';
    var space = /[\s\t]/;
    while(k < line.length && space.test(line[k])){
        k++;
    }
    nline = line.substring(k, line.length);
    return nline;
}

module.exports.prototype = {
    configure: function(disallowMultipleLineComments) {
        assert(
            disallowMultipleLineComments === true,
            'disallowMultipleLineComments option requires a value of true or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowMultipleLineComments';
    },

    check: function(file, errors) {
        var lines = file.getLines();

        var comments = file.getComments();
        for (var i = 0; i < comments.length; i++){
            if (comments[i].type == 'Line') {
                for (var j = 0; j < lines.length; j++){
                    if (NoSapcesBefore(lines[j]) == '/'+'/'+comments[i].value && j < lines.length-1 && i < comments.length-1 && NoSapcesBefore(lines[j+1]) == '/'+'/'+comments[i+1].value){
                        errors.add(
                        'Multiple comments should go with block comment type',
                        comments[i].loc.start
                        );
                    }
                }
            }
        }

    }
};