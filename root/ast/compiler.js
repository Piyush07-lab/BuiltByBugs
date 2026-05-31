//setting up requirements

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const parser = require("@babel/parser");

const config = require("./config");

// const traverse = require("@babel/traverse").default;

//Making a compile function

function compile() {

    const files = config.input.flatMap(pattern =>
        glob.sync(pattern)
    );                                                  //We sync the compiler with global environment

    for (const file of files) {     //Parsing and error catching

        const source = fs.readFileSync(file, "utf-8");

        try {
            const ast = parser.parse(source, {
                sourceType: "module",
                plugins: ["jsx"]
            });

            console.log(`Parsed: ${file}`);
            console.log(`AST Type: ${ast.type}\n`);

            for (const analyzer of config.analyzers) {
                analyzer(ast, file);
            }

            traverse(ast, {

                CallExpression(path) {

                    console.log(
                        `Function Call: ${path.node.callee.type}`
                    );
                }
            });

        } catch (error) {

            console.log(`Failed: ${file}`);
            console.error(error.message);

        }
    }




}
compile();