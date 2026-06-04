const traverse = require("@babel/traverse").default;

module.exports = function (ast, file) {

    const apiCalls = [];

    traverse(ast, {

        CallExpression(path) {

            const callee = path.node.callee;

            if (
                callee.type === "Identifier" &&
                callee.name === "fetch"
            ) {
                const endpoint = path.node.arguments[0];
                const options = path.node.arguments[1];

                if (!endpoint) {
                    return;
                }

                let method = "GET";

                if (options && options.type === "ObjectExpression") {

                    for (const property of options.properties) {

                        if (property.key.name === "method") {
                            method = property.value.value;
                        }

                    }

                }

                if (endpoint.type === "StringLiteral") {

                    apiCalls.push({
                        file,
                        endpoint: endpoint.value,
                        method
                    });

                }
            }
        }
    })

    return {
        type: "apiCalls",
        data: apiCalls
    }
}