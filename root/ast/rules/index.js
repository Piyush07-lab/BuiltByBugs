const domQueryThreshold = require("./dom-q-threshold");

module.exports = function(projectModel) {

    return [
        ...domQueryThreshold(projectModel)
    ];

}