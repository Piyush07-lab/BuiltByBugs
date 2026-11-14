/**
 * Configuration and policies for BuiltByBugs AI Site & Creator Assistant
 */

export const STREAM_CONFIG = {
    IDLE_TIMEOUT_MS: 300000, // 5 minutes
    MAX_HISTORY_MESSAGES: 10,
    HEARTBEAT_INTERVAL_MS: 30000 // 30 seconds
};

export const CREATOR_PROFILE = {
    name: "Piyush Mishra",
    brand: "BuiltByBugs",
    title: "Full-Stack AI systems Architect & Developer",
    summary:
        "Specializes in scalable backend architecture, distributed systems, automation, and full-stack web applications. Passionate about event-driven system design, and clean developer tooling.",
    timezone: "Asia/Kolkata (UTC+5:30)",
    workEmail: process.env.WORK_EMAIL || "contact@builtbybugs.in",
    coreSkills: [
        "JavaScript / TypeScript",
        "Node.js & Express",
        "MongoDB & Redis",
        "MySQL & SQLite",
        "LLM Orchestration / Applied AI Engineering",
        "RabbitMQ & Event-Driven Architecture",
        "React & Vite",
        "Compilers, AST & Static Analysis",
        "REST & GraphQL APIs",
        "CI/CD & Docker",
        "Google cloud console / AWS"
    ],
    services: [
        {
            id: "full-time",
            title: "Full-Time Job",
            description: "High-impact backend and full-stack software engineering roles."
        },
        {
            id: "contract",
            title: "Contract",
            description: "Flexible medium to long-term engineering contracts."
        },
        {
            id: "standalone",
            title: "Standalone Projects",
            description: "End-to-end design, development, and deployment of web apps, APIs, or internal tools."
        },
        {
            id: "web-services",
            title: "Web Services",
            description: "Microservice development, database tuning, API integrations, and automation pipelines."
        }
    ],
    pricing: {
        currency: ["USD", "INR"],
        hourlyRate: {
            floor: ["$15", "₹1400"],
            target: ["$25", "₹2200"],
            ceiling: ["$40", "₹3500"]
        },
        fixedProjectFloor: ["$300", "₹25000"],
        servicePackages: {
            standaloneProjects: ["$250+", "₹22000"],
            webServices: ["$100+", "₹9100+"],
            contractRetainer: ["$350/month", "₹35000/month"] 
        }
    },
    negotiationPolicy: {
        currency: ["USD", "INR"],
        hourlyRate: {
            floor: ["$12", "₹999"],
            target: ["$25", "₹2200"],
            ceiling: ["$50", "₹4800"] 
        },
        fixedProjectFloor: ["$300", "₹25000"], 
        maxDiscountWithoutScopeReductionPercent: 0, // Strict rule: No discounts on price without trading scope or terms
        maxDiscountWithTradeoffsPercent: 20,
        minTurnaroundDays: 7,
        rushMultiplier: 1.3, 
        milestoneStructure: [
            { phase: "Kickoff & Architecture / Foundation", percentage: 40 },
            { phase: "Core Feature Implementation & API Integration", percentage: 40 },
            { phase: "Testing, Documentation & Final Delivery", percentage: 20 }
        ],
        concessionRules: [
            "Never reduce the total price without adjusting project scope, reducing deliverables, or extending the timeline.",
            "If the client's budget is strictly under the fixed project floor, politely inform them of the minimum engagement threshold and suggest open-source resources or starter consults.",
            "Offer a 5% incentive discount only if the client agrees to 50% upfront payment.",
            "When timeline is urgent (under 7 days), apply the 30% rush surcharge."
        ],
        escalationTriggers: [
            "Budget offered is below the configured floor rate.",
            "Project requires tech stack outside core proficiencies (e.g., embedded C, blockchain smart contracts, Swift/iOS native).",
            "Client demands strict IP assignment or NDA terms before proposal review.",
            "Client insists on unbilled pilot work or free trial features."
        ]
    }
};
