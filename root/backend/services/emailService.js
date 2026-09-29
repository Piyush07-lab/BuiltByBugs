/**
 * Service to handle transactional email dispatches via Resend REST API.
 * Uses native fetch (Node.js 20+) to prevent outbound SMTP port-blocking.
 */

/**
 * Dispatches an email via the Resend REST API.
 *
 * @param {Object} options
 * @param {string} [options.to] - Recipient email (defaults to WORK_EMAIL)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML email body
 * @param {string} options.text - Plain text email body
 * @param {string} options.replyTo - Reply-to email address (visitor email)
 * @returns {Promise<{success: boolean, id?: string, simulated?: boolean}>}
 */
async function sendEmail({ to, subject, html, text, replyTo }) {
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = to || process.env.WORK_EMAIL;
    const fromAddress =
        process.env.EMAIL_FROM || "Portfolio Inquiry <onboarding@resend.dev>";

    if (!apiKey || !recipient) {
        console.warn(
            "[EmailService] Missing RESEND_API_KEY or WORK_EMAIL in environment. Simulating dispatch."
        );
        return { success: true, simulated: true };
    }

    const payload = {
        from: fromAddress,
        to: [recipient],
        reply_to: replyTo,
        subject,
        html,
        text,
    };

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend API error (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    return { success: true, id: result.id };
}

/**
 * Sends a notification email for an incoming Hire Request.
 *
 * @param {Object} data
 * @param {string} data.service - Selected service category
 * @param {string} data.name - Visitor name
 * @param {string} data.email - Visitor email
 * @param {string} data.details - Project details or inquiry notes
 */
export async function sendHireNotification({ service, name, email, details }) {
    const selectedService = service || "General Inquiry";
    const subject = `[Portfolio Hire Request] ${selectedService} from ${name}`;
    const timestamp = new Date().toLocaleString("en-US", { timeZoneName: "short" });

    const text = [
        "New Hire Request Received",
        "-------------------------",
        `Time: ${timestamp}`,
        `Service: ${selectedService}`,
        `Client Name: ${name}`,
        `Client Email: ${email}`,
        "",
        "Project Details:",
        details,
    ].join("\n");

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937; line-height: 1.5;">
            <h2 style="color: #059669; margin-bottom: 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                New Hire Request Received
            </h2>
            <p style="color: #6b7280; font-size: 13px; margin-top: 0;">${timestamp}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #4b5563;">Service:</td>
                    <td style="padding: 6px 0; color: #059669; font-weight: 600;">${selectedService}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Name:</td>
                    <td style="padding: 6px 0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Email:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                </tr>
            </table>

            <div style="background-color: #f9fafb; border-left: 4px solid #059669; padding: 12px 16px; border-radius: 4px; margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #374151;">Project Details:</h4>
                <p style="margin: 0; white-space: pre-wrap; color: #1f2937;">${details}</p>
            </div>

            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
                Tip: You can reply directly to this email to respond to ${name}.
            </p>
        </div>
    `;

    return sendEmail({ subject, html, text, replyTo: email });
}

/**
 * Sends a notification email for an incoming Contact Request.
 *
 * @param {Object} data
 * @param {string} data.name - Visitor name
 * @param {string} data.email - Visitor email
 * @param {string} [data.message] - Message content
 * @param {string} [data.details] - Alternative field for message content
 */
export async function sendContactNotification({ name, email, message, details }) {
    const content = message || details;
    const subject = `[Portfolio Contact] New message from ${name}`;
    const timestamp = new Date().toLocaleString("en-US", { timeZoneName: "short" });

    const text = [
        "New Contact Message Received",
        "----------------------------",
        `Time: ${timestamp}`,
        `Sender Name: ${name}`,
        `Sender Email: ${email}`,
        "",
        "Message:",
        content,
    ].join("\n");

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937; line-height: 1.5;">
            <h2 style="color: #2563eb; margin-bottom: 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                New Contact Message Received
            </h2>
            <p style="color: #6b7280; font-size: 13px; margin-top: 0;">${timestamp}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #4b5563;">Name:</td>
                    <td style="padding: 6px 0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Email:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                </tr>
            </table>

            <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; margin-top: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #374151;">Message:</h4>
                <p style="margin: 0; white-space: pre-wrap; color: #1f2937;">${content}</p>
            </div>

            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
                Tip: You can reply directly to this email to respond to ${name}.
            </p>
        </div>
    `;

    return sendEmail({ subject, html, text, replyTo: email });
}
