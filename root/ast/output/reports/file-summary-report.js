module.exports = function(projectModel) {

    let markdown = "# File Summary Report\n\n";

    for (const [file, data] of Object.entries(projectModel.files)) {

        markdown += `## ${file}\n\n`;

        markdown += `- Imports: ${data.imports.length}\n`;
        markdown += `- API Calls: ${data.apiCalls.length}\n`;
        markdown += `- DOM Queries: ${data.domQueries.length}\n`;
        markdown += `- Event Listeners: ${data.eventListener.length}\n`;

        markdown += "\n";

        if (data.apiCalls.length > 0) {
            markdown += `- Endpoints:\n`;

            for (const api of data.apiCalls) {
                markdown += `  - ${api.method} ${api.endpoint}\n`;
            }

            markdown += "\n";
        }

        markdown += "---\n\n";
    }

    return markdown;
}