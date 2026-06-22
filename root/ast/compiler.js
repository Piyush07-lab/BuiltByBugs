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
const fileSummaryReport = require("./reports/file-summary-report");
const metricsReport = require("./reports/metrics-report");
const markdownWriter = require("./writers/md-writer");
const runRules = require("./rules");


function buildFileModel(projectModel) {

    const files = {};

    const ensureFile = (file) => {

        if (!files[file]) {

            files[file] = {
                imports: [],
                apiCalls: [],
                domQueries: [],
                eventListener: []
            };

        }

    };

    for (const item of projectModel.imports) {

        ensureFile(item.file);

        files[item.file].imports.push(item);

    }

    for (const item of projectModel.apiCalls) {

        ensureFile(item.file);

        files[item.file].apiCalls.push(item);

    }

    for (const item of projectModel.domQueries) {

        ensureFile(item.file);

        files[item.file].domQueries.push(item);

    }

    for (const item of projectModel.eventListener) {

        ensureFile(item.file);

        files[item.file].eventListener.push(item);

    }

    return files;

}l

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
    
    projectModel.files = buildFileModel(projectModel);
    
    const diagnostics = runRules(projectModel);

    const markdown = {
        imports: importReport(projectModel),
        api: apiReport(projectModel),
        dom: domReport(projectModel),
        events: eventReport(projectModel),
        fileSummary: fileSummaryReport(projectModel),
        metrics: metricsReport(projectModel)
    };

    markdownWriter(markdown);

}
compile();