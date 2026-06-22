module.exports = function (projectModel) {

    let markdown = "# Metrics Report\n\n";

    const files = Object.entries(projectModel.files);

    const mostDom = [...files]

        .sort((a, b) => b[1].domQueries.length - a[1].domQueries.length)[0];

    const mostEvents = [...files]

        .sort((a, b) => b[1].eventListener.length - a[1].eventListener.length)[0];

    const mostApi = [...files]

        .sort((a, b) => b[1].apiCalls.length - a[1].apiCalls.length)[0];

    const mostImports = [...files]

        .sort((a, b) => b[1].imports.length - a[1].imports.length)[0];


    markdown += `## Most DOM Queries\n`;

    markdown += `${mostDom[0]} (${mostDom[1].domQueries.length})\n\n`;


    markdown += `## Most Event Listeners\n`;

    markdown += `${mostEvents[0]} (${mostEvents[1].eventListener.length})\n\n`;


    markdown += `## Most API Calls\n`;

    markdown += `${mostApi[0]} (${mostApi[1].apiCalls.length})\n\n`;


    markdown += `## Most Imports\n`;

    markdown += `${mostImports[0]} (${mostImports[1].imports.length})\n\n`;
    

    return markdown;
};