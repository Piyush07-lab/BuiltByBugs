const traverse = require("@babel/traverse").default;

module.exports = function (ast, file) {

    const imports = [];

    traverse(ast, {

        ImportDeclaration(path){

            const specifier = path.node.specifiers;
            const source = path.node.source;

            // console.log(JSON.stringify(path.node, null, 2));

            imports.push({
                file,
                specifier: specifier[0].imported.name,
                source: source.value
            })

        }
    })

    return imports;
}