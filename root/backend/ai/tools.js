/**
 * Tool definitions and execution handlers for BuiltByBugs AI System
 */

import { CREATOR_PROFILE } from "../config/aiConfig.js";
import { SITE_KNOWLEDGE } from "./knowledgeBase.js";
import { getUserAndRepos } from "../utils/github.js";
import { getCachedWakaTimeData, buildCodingSummary } from "../api/coding.js";
import { fetchLeetcodeData } from "../api/leetcode.js";
import { isValidHireRequest, isValidContactRequest } from "../utils/spamFilter.js";
import {
    sendHireNotification,
    sendContactNotification,
} from "../services/emailService.js";

/**
 * Gemini Function Declarations Schema
 */
export const toolDeclarations = [
    {
        name: "getSiteKnowledge",
        description:
            "Retrieve verified information about Piyush Mishra, BuiltByBugs site architecture, technical articles, resume, and available services.",
        parameters: {
            type: "OBJECT",
            properties: {
                category: {
                    type: "STRING",
                    enum: [
                        "bio",
                        "skills",
                        "articles",
                        "projects",
                        "pricing",
                        "services",
                        "creator",
                        "documents",
                        "all",
                    ],
                    description: "Specific domain of knowledge to query.",
                },
                query: {
                    type: "STRING",
                    description:
                        "Optional specific topic or keyword (e.g. 'AST', 'MongoDB', 'RabbitMQ', 'resume').",
                },
            },
        },
    },
    {
        name: "getCodingStats",
        description:
            "Fetch live developer activity metrics including WakaTime hours, top programming languages, active projects, and LeetCode problem-solving stats.",
        parameters: {
            type: "OBJECT",
            properties: {},
        },
    },
    {
        name: "getGitHubProjects",
        description:
            "Retrieve live public GitHub repositories, open-source work, stars, and technology stacks created by Piyush.",
        parameters: {
            type: "OBJECT",
            properties: {
                limit: {
                    type: "INTEGER",
                    description: "Maximum number of repositories to return (default 6).",
                },
            },
        },
    },
    {
        name: "evaluateNegotiation",
        description:
            "Evaluate a client's proposed budget and currency(USD / INR), timeline, or scope against the creator's strict negotiation policies and boundaries. Returns acceptable counter-offers, trade-offs, or flags for human escalation.",
        parameters: {
            type: "OBJECT",
            properties: {
                proposedBudget: {
                    type: "NUMBER",
                    description:
                        "The budget offered by the client in the selected currency (USD or INR).",
                },
                currency: {
                    type: "STRING",
                    enum: ["USD", "INR"],
                    description:
                        "Currency chosen by the client ('USD' selects index [0], 'INR' selects index [1]). Defaults to 'USD'.",
                },
                proposedHours: {
                    type: "NUMBER",
                    description: "Estimated hours if calculating hourly engagement.",
                },
                timelineDays: {
                    type: "NUMBER",
                    description: "Requested completion timeframe in calendar days.",
                },
                scopeDescription: {
                    type: "STRING",
                    description:
                        "Brief summary of the requested features or project scope.",
                },
                isUpfrontPaymentAgreed: {
                    type: "BOOLEAN",
                    description:
                        "Whether the client agrees to 100% upfront payment (eligible for 5% incentive discount).",
                },
            },
            required: ["proposedBudget", "scopeDescription"],
        },
    },
    {
        name: "draftProjectProposal",
        description:
            "Create a structured, itemized project proposal and scope of work for a client. Renders an interactive proposal card in the chat window.",
        parameters: {
            type: "OBJECT",
            properties: {
                clientName: {
                    type: "STRING",
                    description: "Name of client or company.",
                },
                projectName: {
                    type: "STRING",
                    description: "Title of proposed project.",
                },
                summary: {
                    type: "STRING",
                    description:
                        "High-level summary of architecture, solution, and value delivered.",
                },
                recommendedStack: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    description:
                        "List of recommended technologies (e.g. ['Node.js', 'React', 'MongoDB']).",
                },
                deliverables: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            description: { type: "STRING" },
                            estimatedDays: { type: "INTEGER" },
                        },
                        required: ["title", "description", "estimatedDays"],
                    },
                    description: "Itemized breakdown of milestones and deliverables.",
                },
                timelineWeeks: {
                    type: "NUMBER",
                    description: "Estimated turnaround time in weeks.",
                },
                totalEstimatedCost: {
                    type: "NUMBER",
                    description:
                        "Total estimated project cost in the selected currency (USD or INR).",
                },
                currency: {
                    type: "STRING",
                    enum: ["USD", "INR"],
                    description:
                        "Currency for the proposal ('USD' or 'INR'). Defaults to 'USD'.",
                },
                billingType: {
                    type: "STRING",
                    enum: ["Fixed-Price", "Milestone-Based", "Hourly"],
                    description: "Structure of financial engagement.",
                },
            },
            required: [
                "clientName",
                "projectName",
                "summary",
                "recommendedStack",
                "deliverables",
                "timelineWeeks",
                "totalEstimatedCost",
                "billingType",
            ],
        },
    },
    {
        name: "submitInquiry",
        description:
            "Automatically submit a validated client inquiry or formal hire request on behalf of the user, notifying Piyush via email.",
        parameters: {
            type: "OBJECT",
            properties: {
                type: {
                    type: "STRING",
                    enum: ["hire", "contact"],
                    description: "Inquiry type.",
                },
                service: {
                    type: "STRING",
                    enum: [
                        "Full-Time Job",
                        "Contract",
                        "Standalone Projects",
                        "Web Services",
                        "General Inquiry",
                    ],
                    description: "Target service category.",
                },
                name: {
                    type: "STRING",
                    description: "Full name of the user/client.",
                },
                email: {
                    type: "STRING",
                    description: "Valid email address for follow-up.",
                },
                details: {
                    type: "STRING",
                    description:
                        "Comprehensive scope, requirements, agreed budget, or inquiry notes.",
                },
            },
            required: ["type", "name", "email", "details"],
        },
    },
];

export function parseAmount(value, currency = "USD", fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const normalizedCurrency = String(currency || "USD").toUpperCase();
    const index = normalizedCurrency === "INR" ? 1 : 0;
    const raw = Array.isArray(value) ? (value[index] ?? value[0]) : value;
    const cleaned = String(raw ?? "").replace(/[^0-9.]/g, "");
    const parsed = Number(cleaned);
    return parsed > 0 ? parsed : fallback;
}

/**
 * Tool Execution Dispatcher
 */
export async function executeTool(name, args = {}) {
    switch (name) {
        case "getSiteKnowledge": {
            const { category = "all", query = "" } = args;
            const q = query.toLowerCase().trim();

            const data = {};
            if (category === "all" || category === "bio" || category === "creator") {
                data.bio = SITE_KNOWLEDGE.bio;
                data.creator = SITE_KNOWLEDGE.creator;
                data.services = CREATOR_PROFILE.services;
            }
            if (category === "all" || category === "skills") {
                data.skills = {
                    coreSkills: CREATOR_PROFILE.coreSkills,
                    ...SITE_KNOWLEDGE.skills,
                };
            }
            if (category === "all" || category === "projects") {
                data.projects = SITE_KNOWLEDGE.projects;
            }
            if (category === "all" || category === "pricing") {
                data.pricing = {
                    ...SITE_KNOWLEDGE.pricing,
                    ...CREATOR_PROFILE.pricing,
                };
            }
            if (category === "all" || category === "articles") {
                data.articles = SITE_KNOWLEDGE.articles.filter(
                    (a) =>
                        !q ||
                        a.title.toLowerCase().includes(q) ||
                        a.tags.some((t) => t.toLowerCase().includes(q)) ||
                        a.abstract.toLowerCase().includes(q)
                );
            }
            if (category === "all" || category === "documents") {
                data.documents = SITE_KNOWLEDGE.documents;
            }
            if (category === "all" || category === "services") {
                data.services = CREATOR_PROFILE.services;
            }

            return {
                status: "success",
                result: data,
            };
        }

        case "getCodingStats": {
            const summary = {
                wakatime: null,
                leetcode: null,
            };

            const [wakaOutcome, leetOutcome] = await Promise.allSettled([
                getCachedWakaTimeData(),
                fetchLeetcodeData(),
            ]);

            if (wakaOutcome.status === "fulfilled") {
                const built = buildCodingSummary(wakaOutcome.value);
                summary.wakatime = {
                    totalHours: (built.totalMinutes / 60).toFixed(1),
                    humanTotal: built.totalText,
                    dailyAverageText: built.dailyAverageText,
                    topLanguages: built.languages
                        .slice(0, 5)
                        .map((l) => `${l.name} (${l.percent}%)`),
                    topEditors: built.editors.slice(0, 3).map((e) => e.name),
                    topProjects: built.projects.slice(0, 4).map((p) => p.name),
                };
            } else {
                summary.wakatime = {
                    note:
                        "WakaTime data currently caching or offline: " +
                        wakaOutcome.reason.message,
                };
            }

            if (leetOutcome.status === "fulfilled") {
                const leetRaw = leetOutcome.value;
                const matchedUser = leetRaw?.matchedUser || leetRaw;
                const acStats = matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
                const ranking = matchedUser?.profile?.ranking || "N/A";
                summary.leetcode = {
                    username: matchedUser?.username || "PiyushMishra07",
                    ranking,
                    solvedBreakdown: acStats.reduce((acc, curr) => {
                        acc[curr.difficulty] = curr.count;
                        return acc;
                    }, {}),
                };
            } else {
                summary.leetcode = {
                    note:
                        "LeetCode stats currently offline: " + leetOutcome.reason.message,
                };
            }

            return {
                status: "success",
                result: summary,
            };
        }

        case "getGitHubProjects": {
            const limit = Math.max(1, Math.min(args.limit || 6, 12));
            try {
                const ghData = await getUserAndRepos();
                const repos = (ghData.repos || [])
                    .filter((r) => !r.fork)
                    .slice(0, limit)
                    .map((r) => ({
                        name: r.name,
                        description: r.description || "Full-stack project",
                        stars: r.stargazers_count,
                        language: r.language,
                        url: r.html_url,
                        updatedAt: r.updated_at,
                    }));

                return {
                    status: "success",
                    result: {
                        user: {
                            login: ghData.user?.login,
                            publicRepos: ghData.user?.public_repos,
                            bio: ghData.user?.bio,
                        },
                        repos,
                    },
                };
            } catch (err) {
                return {
                    status: "error",
                    message: "Failed to retrieve GitHub repos: " + err.message,
                };
            }
        }

        case "evaluateNegotiation": {
            const policy = CREATOR_PROFILE.negotiationPolicy;
            const selectedCurrency =
                String(args.currency || "USD").toUpperCase() === "INR" ? "INR" : "USD";
            const symbol = selectedCurrency === "INR" ? "₹" : "$";
            const fixedFloor = parseAmount(
                policy.fixedProjectFloor,
                selectedCurrency,
                selectedCurrency === "INR" ? 25000 : 300
            );
            const hourlyFloor = parseAmount(
                policy.hourlyRate?.floor,
                selectedCurrency,
                selectedCurrency === "INR" ? 999 : 12
            );
            const {
                proposedBudget = 0,
                proposedHours,
                timelineDays,
                scopeDescription: _scopeDescription = "",
                isUpfrontPaymentAgreed = false,
            } = args;

            const assessment = {
                status: "within_bounds",
                currency: selectedCurrency,
                minimumFixedFloor: fixedFloor,
                minimumFixedFloorUsd: fixedFloor,
                effectiveProposedBudget: proposedBudget,
                counterOffer: null,
                tradeoffsRequired: [],
                escalateToCreator: false,
                reason: "",
            };

            // Check absolute floor
            if (proposedBudget < fixedFloor) {
                assessment.status = "below_floor";
                assessment.escalateToCreator = true;
                assessment.reason = `Proposed budget of ${symbol}${proposedBudget} is below the minimum project engagement floor of ${symbol}${fixedFloor}.`;
                assessment.counterOffer = {
                    acceptableMinimumBudget: fixedFloor,
                    suggestedAction:
                        "Offer a consultation starter package or recommend descoping to core architecture MVP only.",
                };
                return { status: "success", result: assessment };
            }

            // Check hourly rate if hours provided
            if (proposedHours && proposedHours > 0) {
                const calculatedHourly = proposedBudget / proposedHours;
                if (calculatedHourly < hourlyFloor) {
                    assessment.status = "below_hourly_floor";
                    assessment.escalateToCreator = true;
                    assessment.reason = `Calculated hourly rate of ${symbol}${calculatedHourly.toFixed(0)}/hr is below minimum floor of ${symbol}${hourlyFloor}/hr.`;
                    assessment.counterOffer = {
                        acceptableMinimumHourly: hourlyFloor,
                        minimumAdjustedBudget: Math.round(hourlyFloor * proposedHours),
                    };
                    return { status: "success", result: assessment };
                }
            }

            // Check rush timeline (< 7 days)
            if (timelineDays && timelineDays < policy.minTurnaroundDays) {
                const surgeCost = Math.round(
                    proposedBudget * (policy.rushMultiplier - 1)
                );
                assessment.tradeoffsRequired.push(
                    `Turnaround of ${timelineDays} days is below standard 7-day minimum. A 30% urgency fee (+${symbol}${surgeCost}) applies unless timeline is extended.`
                );
            }

            // Apply upfront discount incentive if agreed
            if (isUpfrontPaymentAgreed) {
                assessment.tradeoffsRequired.push(
                    "Eligible for 5% upfront commitment discount on overall project milestone."
                );
            }

            // Standard trade-off guidance
            assessment.tradeoffsRequired.push(
                "Scope adjustments: Prioritize core API, auth, and database architecture for Milestone 1. Secondary features can be deferred to Milestone 2."
            );

            return {
                status: "success",
                result: assessment,
            };
        }

        case "draftProjectProposal": {
            const policy = CREATOR_PROFILE.negotiationPolicy;
            const proposalId = "BBB-PROP-" + Date.now().toString(36).toUpperCase();

            // Calculate standard milestone allocations
            const total = Number(args.totalEstimatedCost) || 500;
            const milestones = policy.milestoneStructure.map((m) => ({
                phase: m.phase,
                percentage: m.percentage,
                amount: Math.round((m.percentage / 100) * total),
            }));

            const proposal = {
                proposalId,
                createdAt: new Date().toISOString(),
                clientName: args.clientName,
                projectName: args.projectName,
                summary: args.summary,
                recommendedStack: args.recommendedStack || [],
                deliverables: args.deliverables || [],
                timelineWeeks: args.timelineWeeks,
                totalEstimatedCost: total,
                currency:
                    String(args.currency || "USD").toUpperCase() === "INR"
                        ? "INR"
                        : "USD",
                billingType: args.billingType || "Milestone-Based",
                milestones,
                terms: [
                    "50% milestone payable upon architectural kickoff approval.",
                    "Source code delivered via private GitHub repo with comprehensive documentation.",
                    "Includes 14 days of complimentary post-delivery bug-fix warranty.",
                ],
            };

            return {
                status: "success",
                action: "RENDER_PROPOSAL",
                proposal,
                message: `Proposal #${proposalId} drafted successfully for ${args.clientName}.`,
            };
        }

        case "submitInquiry": {
            const {
                type = "hire",
                service = "General Inquiry",
                name,
                email,
                details,
            } = args;

            if (type === "hire") {
                const validation = isValidHireRequest({ service, name, email, details });
                if (!validation.ok) {
                    return {
                        status: "validation_error",
                        error: validation.reason,
                    };
                }

                await sendHireNotification({ service, name, email, details });
                return {
                    status: "success",
                    action: "FORM_SUBMITTED",
                    message: `Hire request for ${service} successfully submitted. Piyush has been notified and will reply to ${email}.`,
                };
            } else {
                const validation = isValidContactRequest({
                    name,
                    email,
                    message: details,
                    details,
                });
                if (!validation.ok) {
                    return {
                        status: "validation_error",
                        error: validation.reason,
                    };
                }

                await sendContactNotification({ name, email, message: details });
                return {
                    status: "success",
                    action: "FORM_SUBMITTED",
                    message: `Contact message successfully sent. Piyush has been notified and will reply to ${email}.`,
                };
            }
        }

        default:
            return {
                status: "error",
                message: `Unknown tool name: ${name}`,
            };
    }
}
