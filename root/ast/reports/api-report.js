module.exports = function(projectModel) {

    const apiCalls = projectModel.apiCalls;
    
    const totalApiCalls = apiCalls.length;

    let markdown = "# API Calls Report\n\n";
    markdown += `Total API Calls: ${totalApiCalls}\n\n`;

    for (const item of apiCalls) {
        markdown += `- ${item.file} → ${item.source}\n`;
    }

    return markdown;
}