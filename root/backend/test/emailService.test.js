import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
    sendHireNotification,
    sendContactNotification,
} from "../services/emailService.js";

describe("EmailService Suite", () => {
    const originalEnv = { ...process.env };
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        // Reset env and global fetch before each test
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        globalThis.fetch = originalFetch;
    });

    describe("Simulation Fallback Mode", () => {
        it("should simulate dispatch when RESEND_API_KEY is missing", async () => {
            delete process.env.RESEND_API_KEY;
            process.env.WORK_EMAIL = "work@example.com";

            const result = await sendHireNotification({
                service: "Web Development",
                name: "John Doe",
                email: "john@example.com",
                details: "Looking for a full-stack portfolio.",
            });

            assert.equal(result.success, true);
            assert.equal(result.simulated, true);
        });

        it("should simulate dispatch when WORK_EMAIL is missing", async () => {
            process.env.RESEND_API_KEY = "re_test_dummy_key";
            delete process.env.WORK_EMAIL;

            const result = await sendContactNotification({
                name: "Jane Doe",
                email: "jane@example.com",
                message: "General inquiry message.",
            });

            assert.equal(result.success, true);
            assert.equal(result.simulated, true);
        });
    });

    describe("Active Dispatch with Resend API", () => {
        it("should send Hire Request email with correct headers and payload", async () => {
            process.env.RESEND_API_KEY = "re_live_test_key";
            process.env.WORK_EMAIL = "mywork@company.com";
            process.env.EMAIL_FROM = "Portfolio <inquiries@builtbybugs.in>";

            let capturedUrl = "";
            let capturedOptions = null;

            globalThis.fetch = async (url, options) => {
                capturedUrl = url;
                capturedOptions = options;
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ id: "msg_hire_12345" }),
                };
            };

            const result = await sendHireNotification({
                service: "UI/UX Design",
                name: "Alice Smith",
                email: "alice@example.com",
                details: "Need modern landing page redesign.",
            });

            assert.equal(result.success, true);
            assert.equal(result.id, "msg_hire_12345");
            assert.equal(capturedUrl, "https://api.resend.com/emails");
            assert.equal(capturedOptions.method, "POST");
            assert.equal(
                capturedOptions.headers["Authorization"],
                "Bearer re_live_test_key"
            );
            assert.equal(capturedOptions.headers["Content-Type"], "application/json");

            const payload = JSON.parse(capturedOptions.body);
            assert.equal(payload.from, "Portfolio <inquiries@builtbybugs.in>");
            assert.deepEqual(payload.to, ["mywork@company.com"]);
            assert.equal(payload.reply_to, "alice@example.com");
            assert.match(payload.subject, /UI\/UX Design/);
            assert.match(payload.subject, /Alice Smith/);
            assert.match(payload.text, /Alice Smith/);
            assert.match(payload.text, /alice@example.com/);
            assert.match(payload.text, /UI\/UX Design/);
            assert.match(payload.text, /Need modern landing page redesign\./);
            assert.match(payload.html, /alice@example.com/);
        });

        it("should send Contact email with message and reply_to header", async () => {
            process.env.RESEND_API_KEY = "re_live_test_key";
            process.env.WORK_EMAIL = "mywork@company.com";
            delete process.env.EMAIL_FROM; // Test default fallback

            let capturedOptions = null;

            globalThis.fetch = async (url, options) => {
                capturedOptions = options;
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ id: "msg_contact_67890" }),
                };
            };

            const result = await sendContactNotification({
                name: "Bob Builder",
                email: "bob@builder.com",
                message: "Can we collaborate on an open-source project?",
            });

            assert.equal(result.success, true);
            assert.equal(result.id, "msg_contact_67890");

            const payload = JSON.parse(capturedOptions.body);
            assert.equal(payload.from, "Portfolio Inquiry <onboarding@resend.dev>");
            assert.deepEqual(payload.to, ["mywork@company.com"]);
            assert.equal(payload.reply_to, "bob@builder.com");
            assert.match(payload.subject, /Bob Builder/);
            assert.match(payload.text, /Can we collaborate/);
            assert.match(payload.html, /Can we collaborate/);
        });

        it("should handle alternative 'details' field in Contact Notification", async () => {
            process.env.RESEND_API_KEY = "re_live_test_key";
            process.env.WORK_EMAIL = "mywork@company.com";

            let capturedOptions = null;
            globalThis.fetch = async (url, options) => {
                capturedOptions = options;
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ id: "msg_contact_details" }),
                };
            };

            const result = await sendContactNotification({
                name: "Carol White",
                email: "carol@example.com",
                details: "Details provided instead of message.",
            });

            assert.equal(result.success, true);
            const payload = JSON.parse(capturedOptions.body);
            assert.match(payload.text, /Details provided instead of message\./);
        });

        it("should throw informative error when Resend API returns non-200", async () => {
            process.env.RESEND_API_KEY = "re_invalid_key";
            process.env.WORK_EMAIL = "mywork@company.com";

            globalThis.fetch = async () => ({
                ok: false,
                status: 401,
                text: async () =>
                    JSON.stringify({
                        statusCode: 401,
                        message: "Invalid API key",
                    }),
            });

            await assert.rejects(
                async () => {
                    await sendHireNotification({
                        service: "Backend API",
                        name: "Eve Hacker",
                        email: "eve@example.com",
                        details: "Testing error handling.",
                    });
                },
                {
                    name: "Error",
                    message: /Resend API error \(401\)/,
                }
            );
        });
    });
});
