const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const config = require("./config");
const projectModel = require("./project-model");
const importReport = require("./reports/import-report");
const apiReport = require("./reports/api-report");
const domReport = require("./reports/dom-report");
const eventReport = require("./reports/event-report");
const markdownWriter = require("./writers/md-writer");

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

    const markdown = {
        imports: importReport(projectModel),
        api: apiReport(projectModel),
        dom: domReport(projectModel),
        events: eventReport(projectModel)
    };

    markdownWriter(markdown);

    console.log(projectModel);



}
compile();