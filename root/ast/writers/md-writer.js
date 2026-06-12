const fs = require("fs");
const path = require("path");

module.exports = function (markdown) {

    const outputDir = path.join(__dirname, "../output");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(
        path.join(outputDir, "imports.md"),
        markdown.imports
    );

    fs.writeFileSync(
        path.join(outputDir, "api-calls.md"),
        markdown.api
    );

    fs.writeFileSync(
        path.join(outputDir, "dom-queries.md"),
        markdown.dom
    );

    fs.writeFileSync(
        path.join(outputDir, "event-listeners.md"),
        markdown.events
    );

}