module.exports = function (projectModel) {

    console.log("duplicate-dom-query running");

    const diagnostics = [];

    for (const [file, data] of Object.entries(projectModel.files)) {

        const queries = {};

        for (const query of data.domQueries) {

            const key = `${query.method}:${query.argument}`;

            queries[key] ??= [];

            queries[key].push(query);

        }

        for (const [key, matches] of Object.entries(queries)) {

            if (matches.length > 1) {

                diagnostics.push({
                    severity: "info",
                    rule: "duplicate-dom-query",
                    file,
                    message: `Duplicate DOM query detected: ${key}`
                });

            }

        }

    }

    return diagnostics;

};