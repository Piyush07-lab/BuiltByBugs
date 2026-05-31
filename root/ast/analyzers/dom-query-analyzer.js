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
                    callee.property?.name === "querySelector"  ||
                    callee.property?.name === "querySelectorAll"
                )
            ) {
                const arg = path.node.arguments[0];

                if (!arg) {
                    return;
                }

                if (arg.type !== "StringLiteral") {
                    return;
                }

                const method = callee.property.name;

                domQueries.push({
                    file,
                    method,
                    argument: arg.value
                });
                
            }
        }
    });

    return domQueries;
    
};