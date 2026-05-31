const domQueryAnalyzer = require("./analyzers/dom-query-analyzer");
const importAnalyzer = require("./analyzers/import-analyzer");

module.exports = {

    input: [
        "./*.js",
        "./frontend/**/*.js"
    ],

    analyzers: [
        domQueryAnalyzer,
        importAnalyzer
    ],

    transforms: []
};