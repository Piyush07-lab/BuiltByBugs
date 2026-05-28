const traverse = require("@babel/traverse").default;

module.exports = function(ast, file) {

    const domQueries = [];

    traverse(ast, {

        CallExpression(path) {

            const callee = path.node.callee;

            if (
                callee.object?.name === "document" &&
                (
                    callee.property?.name === "getElementById" ||
                    callee.property?.name === "querySelector"
                )
            ) {
                const arg = path.node.arguments[0];

                domQueries.push({
                    file,
                    selector
                });
                
            }
        }
    });

    return domQueries;
};