const importReport = require("./import-report");
const apiReport = require("./api-report");
const domReport = require("./dom-report");
const eventReport = require("./event-report");

module.exports = function(projectModel) {
    importReport(projectModel);
    apiReport(projectModel);
    domReport(projectModel);
    eventReport(projectModel);
}