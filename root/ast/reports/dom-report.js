module.exports = function(projectModel) {

    const domQueries = projectModel.domQueries;
    
    const totalDomQueries = domQueries.length;

    let markdown = "# Dom Queries Report\n\n";
    markdown += `Total Dom Queries: ${totalDomQueries}\n\n`;

    for (const item of domQueries) {
        markdown += `- ${item.file} → ${item.source}\n`;
    }

    return markdown;
}