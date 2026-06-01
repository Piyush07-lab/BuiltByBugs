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


                console.log(options);

                if (!endpoint) {
                    return;
                }
                
                if (!options) {
                    method = "GET";
                }

                if (
                    endpoint.type === "StringLiteral" ||
                    options.type === "ObjectExpression"
                ) {

                    apiCalls.push({
                        file,
                        endpoint,
                        method
                    })
                }

            }
        }
    })

    return {
        type: "apiCalls",
        data: apiCalls
    }
}