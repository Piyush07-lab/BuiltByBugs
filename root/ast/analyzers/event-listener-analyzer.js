const traverse = require("@babel/traverse").default;

module.exports = function (ast, file) {

    const eventListener = [];

    traverse(ast, {

        CallExpression(path) {

            const callee = path.node.callee;

            if (
                callee.property?.name === "addEventListener"
            ) {
                const arg = path.node.arguments[1];

                if (!arg) {
                    return;
                }

                if (arg.type !== "StringLiteral") {
                    return;
                }

                const method = callee.property.name;

                eventListener.push({
                    file,
                    method,
                    argument: arg.value
                });
            }
        }

    })

    return {
        type: "eventListener",
        data: eventListener
    };

}