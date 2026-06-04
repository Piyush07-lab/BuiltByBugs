const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const config = require("./config");
const projectModel = require("./project-model");


function compile() {

    const files = config.input.flatMap(pattern =>
        glob.sync(pattern)
    );                                                  

    for (const file of files) {     
        const source = fs.readFileSync(file, "utf-8");

        try {
            const ast = parser.parse(source, {
                sourceType: "module",
                plugins: ["jsx"]
            });

            console.log(`Parsed: ${file}`);
            console.log(`AST Type: ${ast.type}\n`);

            for (const analyzer of config.analyzers) {
                
                const result = analyzer(ast, file);

                projectModel[result.type].push(...result.data);
            }

        } catch (error) {

            console.log(`Failed: ${file}`);
            console.error(error.message);

        }
    }

    console.log(projectModel);
    
    

}
compile();