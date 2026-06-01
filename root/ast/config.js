const domQueryAnalyzer = require("./analyzers/dom-query-analyzer");
const importAnalyzer = require("./analyzers/import-analyzer");
const eventListenerAnalyzer = require("./analyzers/event-listener-analyzer");
const apiCallsAnalyzer = require("./analyzers/API-call-analyzer");

module.exports = {

    input: [
        "./*.js",
        "./frontend/**/*.js"
    ],

    analyzers: [
        domQueryAnalyzer,
        importAnalyzer,
        eventListenerAnalyzer,
        apiCallsAnalyzer
    ],

    transforms: []
};