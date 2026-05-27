const domQueryAnalyzer = require("./analyzers/dom-query-analyzer");

module.exports = {

    input: [
        "./*.js",
        "./frontend/**/*.js"
    ],

    analyzers: [
        domQueryAnalyzer
    ],

    transforms: []
};