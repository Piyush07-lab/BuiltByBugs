module.exports = function (projectModel) {

    const imports = projectModel.imports;

    const totalImports = imports.length;

    let markdown = "# Import Report\n\n";
    markdown += `Total Imports: ${totalImports}\n\n`;

    for (const item of imports) {
        markdown += `- ${item.file} → ${item.source}\n`;
    }

    return markdown;
}

