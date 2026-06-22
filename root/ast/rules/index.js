const duplicateDomQuery = require("./duplicate-dom-query");

module.exports = function (projectModel) {

    return [
        ...duplicateDomQuery(projectModel)
    ];

};