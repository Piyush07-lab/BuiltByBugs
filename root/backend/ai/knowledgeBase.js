/**
 * Knowledge Base & Selective Context Slicer for BuiltByBugs AI System
 */

import { CREATOR_PROFILE, STREAM_CONFIG } from "../config/aiConfig.js";

export const SITE_KNOWLEDGE = {
    bio: {
        name: "Piyush Mishra",
        alias: "Piyush07-lab",
        brand: "BuiltByBugs",
        role: CREATOR_PROFILE.title,
        timezone: CREATOR_PROFILE.timezone,
        summary: CREATOR_PROFILE.summary,
        status: "Available for high-impact contract roles, standalone projects, and full-time opportunities."
    },
    skills: {
        coreStack: CREATOR_PROFILE.coreSkills,
        specialties: [
            "Scalable backend architecture & microservices",
            "Event-driven systems with RabbitMQ & Redis",
            "AST parsing, custom linters & static analysis tooling",
            "MongoDB query & aggregation optimization"
        ]
    },
    projects: {
        overview: "Open-source repositories, full-stack systems, and developer tools showcased on /project.",
        highlights: [
            "BuiltByBugs Portfolio & AI Assistant Platform (React, Vite, Node.js, Gemini Tooling)",
            "Custom AST Static Analysis Rules & Linters",
            "Event-Driven Microservice Workers with RabbitMQ"
        ],
        liveToolHint: "Use getGitHubProjects or getCodingStats for live repository, WakaTime, and LeetCode metrics."
    },
    pricing: {
        hourlyRateRange: "$15 - $40", 
        standaloneProjectStarting: "$300+",
        webServicesStarting: "$50+",
        contractRetainerMonthly: "$350+ / month",
        customNotes: "No service below $15"
    },
    creator: {
        name: "Piyush Mishra",
        alias: "Piyush07-lab",
        leetcodeHandle: "PiyushMishra07",
        title: CREATOR_PROFILE.title,
        bio: "Specializes in backend engineering, distributed architecture, and developer tooling. Creator of BuiltByBugs.",
        status: "Available for high-impact contract roles, standalone projects, and full-time opportunities."
    },
    sitePages: [
        {
            route: "/",
            title: "Home",
            eyebrow: "Full-Stack Developer",
            description: "Overview of software engineering work, core philosophy, and developer foundations."
        },
        {
            route: "/project",
            title: "Project (A Developer's Art Gallery)",
            eyebrow: "Project",
            description: "Showcases open-source contributions, repositories, live GitHub activity, and coding trackers."
        },
        {
            route: "/library",
            title: "The Development Diary",
            eyebrow: "Library",
            description: "Deep technical articles, architectural patterns, and engineering notes."
        }
    ],
    articles: [
        {
            id: "art-1",
            slug: "ast-linters",
            title: "Understanding AST for Custom Linters",
            date: "Sept 2026",
            abstract: "A deep dive into parsing Abstract Syntax Trees and building custom rule engines for static analysis in JavaScript and Python.",
            tags: ["Compilers", "AST", "Static Analysis"],
            takeaways: "Explains how code is broken down into syntax nodes, why custom linters enforce team-specific conventions, and how to write custom visitors."
        },
        {
            id: "art-2",
            slug: "mongodb-aggregations",
            title: "Optimizing MongoDB Aggregations",
            date: "Aug 2026",
            abstract: "Techniques for cutting aggregation latency on multi-million document collections.",
            tags: ["MongoDB", "Database", "Performance"],
            takeaways: "Filter early with $match, leverage compound indexes for $sort, and project out unnecessary fields before memory-intensive $group stages."
        },
        {
            id: "art-3",
            slug: "rabbitmq-microservices",
            title: "Event-Driven Microservices with RabbitMQ",
            date: "Jul 2026",
            abstract: "Architectural patterns for decoupling distributed services using message brokers.",
            tags: ["Architecture", "RabbitMQ", "Microservices"],
            takeaways: "Asynchronous pub/sub decouples service availability, buffers traffic spikes, and ensures resilient failure recovery."
        }
    ],
    documents: [
        {
            id: "doc-1",
            title: "Resume (PDF)",
            slug: "resume",
            description: "Comprehensive summary of experience, education, skills, and past engineering milestones."
        },
        {
            id: "doc-2",
            title: "System Architecture Diagram",
            slug: "architecture",
            description: "High-level visual breakdown of BuiltByBugs service decoupling and event bus."
        },
        {
            id: "doc-3",
            title: "API Specification",
            slug: "api-specification",
            description: "REST & WebSocket endpoints powering site telemetry and AI features."
        }
    ]
};

const SLICE_MATCHERS = {
    bio: /\b(who|about|bio|background|piyush|experience|timezone|available|availability|creator|resume)\b/i,
    skills: /\b(skill|stack|tech|technology|node|react|mongodb|redis|rabbitmq|docker|graphql|api|backend|frontend|typescript|javascript)\b/i,
    articles: /\b(article|blog|diary|library|write|writing|ast|linter|aggregation|microservice|compiler)\b/i,
    projects: /\b(project|repo|repository|github|work|portfolio|built|leetcode|wakatime|coding)\b/i,
    pricing: /\b(price|pricing|cost|rate|budget|quote|proposal|hire|contract|negotiate|discount|fee|usd|inr|pay|milestone)\b/i
};

/**
 * Selects only the relevant context modules for the given user prompt
 * to keep token consumption minimal.
 */
export function sliceContextForPrompt(userText = "") {
    const text = String(userText || "").trim();
    const matchedKeys = [];
    const context = {};

    for (const [key, pattern] of Object.entries(SLICE_MATCHERS)) {
        if (pattern.test(text)) {
            matchedKeys.push(key);
            context[key] = key === "pricing" ? { ...SITE_KNOWLEDGE.pricing, ...CREATOR_PROFILE.pricing } : SITE_KNOWLEDGE[key];
        }
    }

    return {
        identity: `${SITE_KNOWLEDGE.bio.name} (${SITE_KNOWLEDGE.bio.brand}) — ${SITE_KNOWLEDGE.bio.role} (${SITE_KNOWLEDGE.bio.timezone}).`,
        matchedKeys,
        context
    };
}

/**
 * Builds a token-optimized system instruction by appending only matched
 * context slices for the latest user message.
 */
export function buildContextualSystemInstruction(baseInstruction, messages = []) {
    let latestUserText = "";
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i]?.role === "user") {
            const parts = messages[i]?.parts || [];
            latestUserText = parts.map((p) => p?.text || "").join(" ").trim();
            if (latestUserText) break;
        }
    }

    const sliced = sliceContextForPrompt(latestUserText);
    const sliceLines = [`[IDENTITY]: ${sliced.identity}`];

    if (sliced.matchedKeys.length > 0) {
        sliceLines.push(`[RELEVANT SITE CONTEXT (${sliced.matchedKeys.join(", ")})]:`);
        sliceLines.push(JSON.stringify(sliced.context));
    } else {
        sliceLines.push("[CONTEXT NOTE]: Use getSiteKnowledge, getCodingStats, or getGitHubProjects tools if detailed facts are needed.");
    }

    return `${baseInstruction}\n\n${sliceLines.join("\n")}`;
}

/**
 * Trims conversation history to a sliding window of valid { role, parts } turns.
 */
export function trimConversationHistory(messages = [], maxMessages = STREAM_CONFIG.MAX_HISTORY_MESSAGES) {
    if (!Array.isArray(messages)) return [];

    const valid = messages.filter(
        (m) =>
            m &&
            typeof m === "object" &&
            (m.role === "user" || m.role === "model") &&
            Array.isArray(m.parts) &&
            m.parts.length > 0
    );

    if (valid.length <= maxMessages) return valid;
    return valid.slice(-maxMessages);
}
