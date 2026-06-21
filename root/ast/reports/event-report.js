module.exports = function(projectModel) {

    const eventListener = projectModel.eventListener;
    
    const totalEventListener = eventListener.length;

    let markdown = "# Event Listeners Report\n\n";
    markdown += `Total Event-Listener: ${totalEventListener}\n\n`;

    for (const item of eventListener) {
        markdown += `- ${item.file} → ${item.handler}, ${item.event}\n`;
    }

    return markdown;
}