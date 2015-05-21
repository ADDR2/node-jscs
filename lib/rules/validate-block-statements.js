var assert = require('assert');

function semicolonAtTheEnd(line, file){
    var lines = file.getLines();
    var stripped = lines[line-1].replace(/[\s\t]/g, '');

    if (stripped.indexOf('//') > -1)
        stripped = stripped.substr(0, stripped.indexOf('//'));

    if (stripped.indexOf('/*') > -1){
        var copy = stripped;
        stripped = copy.substr(0, copy.indexOf('/*'))+copy.substr(copy.indexOf('*/')+2);
    }
    return stripped[stripped.length-1] == ';';
}

function bodyInLine(line, file){
    var lines = file.getLines();
    var stripped = lines[line-1].replace(/[\s\t\{]/g, '');

    if (stripped.indexOf('//') > -1)
        stripped = stripped.substr(0, stripped.indexOf('//'));

    if (stripped.indexOf('/*') > -1){
        var copy = stripped;
        stripped = copy.substr(0, copy.indexOf('/*'))+copy.substr(copy.indexOf('*/')+2);
    }
    return stripped[stripped.length-1] == ';' || stripped[stripped.length-1] == '}';
}

function getElseLine(line, file){
    var lines = file.getLines();
    var stripped = lines[line-1].replace(/[\s\t]/g, '');

    if (stripped.indexOf('//') > -1)
        stripped = stripped.substr(0, stripped.indexOf('//'));

    if (stripped.indexOf('/*') > -1){
        var copy = stripped;
        stripped = copy.substr(0, copy.indexOf('/*'))+copy.substr(copy.indexOf('*/')+2);
    }
    var findLine = stripped.search('else');
    return (findLine > -1)*(line) + (findLine == -1)*(line-1);
}

module.exports = function() {};

module.exports.prototype = {

    configure: function(validateBlockStatements) {
        assert(
            validateBlockStatements === true,
            'validateBlockStatements option requires true value'
        );
    },

    getOptionName: function() {
        return 'validateBlockStatements';
    },

    check: function(file, errors) {

        function addError1(typeString, node) {
            errors.add(
                typeString + " statement's body should be at the same line.",
                node.loc.start.line,
                node.loc.start.column
            );
        }

        function addError2(typeString, node) {
            errors.add(
                typeString + " statement's body should be under it.",
                node.loc.start.line,
                node.loc.start.column
            );
        }

        function checkBody(type, typeString) {
            file.iterateNodesByType(type, function(node) {
                if (node.body && node.body.type !== 'BlockStatement' && !semicolonAtTheEnd(node.loc.start.line, file))
                    addError1(typeString, node);
                else
                    if (node.body && node.body.type === 'BlockStatement' && bodyInLine(node.loc.start.line, file))
                        addError2(typeString, node);
            });
        }

        file.iterateNodesByType('IfStatement', function(node) {
            if (node.consequent && node.consequent.type !== 'BlockStatement' && !semicolonAtTheEnd(node.loc.start.line, file))
                addError1('If', node);
            else
                if (node.consequent && node.consequent.type === 'BlockStatement' && bodyInLine(node.loc.start.line, file))
                        addError2('If', node);

            if (node.alternate && node.alternate.type !== 'BlockStatement' && !semicolonAtTheEnd(getElseLine(node.alternate.loc.start.line, file), file)) {

                errors.add(
                    'Else' + " statement's body should be at the same line.",
                    getElseLine(node.alternate.loc.start.line, file),
                    node.alternate.loc.start.column
                );
            }else
                if (node.alternate && node.alternate.type === 'BlockStatement' && bodyInLine(getElseLine(node.alternate.loc.start.line, file), file)){
                    errors.add(
                        'Else' + " statement's body should be under it.",
                        getElseLine(node.alternate.loc.start.line, file),
                        node.alternate.loc.start.column
                    );
                }

        });

        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (node.body && node.body.type === 'BlockStatement' && bodyInLine(node.loc.start.line, file))
                addError2('Function', node);
        });

        checkBody('WhileStatement', 'While');

        checkBody('ForStatement', 'For');
        checkBody('ForInStatement', 'For in');

        checkBody('DoWhileStatement', 'Do while');

        checkBody('WithStatement', 'With');
    }

};