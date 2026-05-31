const traverse = require("@babel/traverse").default;

module.exports = function (ast, files) {

    const imports = [];

    traverse(ast, {

        ImportDeclaration(path){

            const specifier = path.node.specifiers;
            const source = path.node.source;

            imports.push({
                file,
                specifier: specifier.value,
                source: source.value
            })

        }
    })

    return imports;
}