const traverse = require("@babel/traverse").default;

module.exports = function (ast, file) {

    const eventListener = [];

    traverse(ast, {

        CallExpression(path) {

            const callee = path.node.callee;

            if (
                callee.property?.name === "addEventListener"
            ) {
                const event = path.node.arguments[0];
                const handler = path.node.arguments[1];

                if (!event || !handler) {
                    return;
                }

                if (handler.type === "Identifier") {

                    const handlerName = handler.name;

                    eventListener.push({
                        file,
                        event: event.value,
                        handler: handler.type,
                        handlerName
                    });

                } else {

                    eventListener.push({
                        file,
                        event: event.value,
                        handler: handler.type,
                    });

                }



            }
        }

    })

    return {
        type: "eventListener",
        data: eventListener
    };

}