module.exports = function(diagnostics) {

    return {
        total: diagnostics.length,
        diagnostics
    };

};