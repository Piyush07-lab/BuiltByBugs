import resumePdf from './assets/resume.pdf';

export const articles = [
    {
        id: "art-1",
        title: "Understanding AST for Custom Linters",
        date: "Sept 2026",
        abstract: "A deep dive into parsing Abstract Syntax Trees and building a custom rule engine for static analysis in JavaScript and Python.",
        tags: ["Compilers", "AST", "Static Analysis"],
        content: `
# Understanding AST for Custom Linters

Building a custom linter requires understanding how your code is represented by the compiler. The Abstract Syntax Tree (AST) is the foundational data structure used in this process.

## What is an AST?

An AST is a tree representation of the abstract syntactic structure of source code written in a programming language. Each node of the tree denotes a construct occurring in the source code.

### Why build a custom linter?
- Enforce domain-specific rules that standard tools like ESLint or Pylint don't cover.
- Deep architectural analysis.
- Prevent anti-patterns unique to your team's codebase.

In the upcoming parts of this series, we will build a parser from scratch...
        `
    },
    {
        id: "art-2",
        title: "Optimizing MongoDB Aggregations",
        date: "Aug 2026",
        abstract: "Practical tips and examples for speeding up complex MongoDB aggregation pipelines on large datasets.",
        tags: ["MongoDB", "Database", "Performance"],
        content: `
# Optimizing MongoDB Aggregations

When working with large collections, aggregation pipelines can become a bottleneck if not properly optimized. 

## Key Strategies
1. **$match Early**: Always filter your dataset as early as possible in the pipeline.
2. **Indexing**: Ensure your \`$match\` and \`$sort\` stages use indexes. 
3. **Limit Data**: Use \`$project\` to remove unnecessary fields before passing documents to memory-intensive stages like \`$group\` or \`$lookup\`.

By applying these three rules, I managed to cut down query times on a 10M+ document collection from 5s to under 100ms.
        `
    },
    {
        id: "art-3",
        title: "Event-Driven Microservices with RabbitMQ",
        date: "Jul 2026",
        abstract: "Architectural patterns for decoupling services using message brokers and event-driven design.",
        tags: ["Architecture", "RabbitMQ", "Microservices"],
        content: `
# Event-Driven Microservices

Decoupling your backend services can dramatically increase system resilience and developer velocity. 

## The Core Concept
Instead of synchronous HTTP calls (Service A calling Service B and waiting), Service A emits an event. Service B (and maybe Service C) listens for that event and reacts asynchronously.

This means if Service B goes down, Service A is completely unaffected. The message broker (like RabbitMQ) will queue the event until Service B is back online.
        `
    }
];

export const documents = [
    {
        id: "doc-1",
        title: "Resume (PDF)",
        description: "My latest resume detailing my work history, skills, and education.",
        icon: "resume",
        link: resumePdf
    },
    {
        id: "doc-2",
        title: "System Architecture Diagram",
        description: "A high-level view of the BuiltByBugs platform architecture.",
        icon: "diagram",
        link: "#"
    },
    {
        id: "doc-3",
        title: "API Documentation",
        description: "OpenAPI specification for the custom backend services.",
        icon: "api",
        link: "#"
    }
];

export const mockCodingSummary = {
    totalText: "35 hrs 12 mins",
    dailyAverageText: "5 hrs 2 mins",
    languages: [
        { name: "JavaScript", percent: 65, text: "22 hrs 52 mins" },
        { name: "Python", percent: 20, text: "7 hrs 2 mins" },
        { name: "CSS", percent: 10, text: "3 hrs 31 mins" },
        { name: "HTML", percent: 5, text: "1 hr 45 mins" }
    ],
    projects: [
        { name: "BuiltByBugs-Platform", text: "15 hrs 20 mins" },
        { name: "AST-Linter-Core", text: "12 hrs 10 mins" },
        { name: "Personal-API", text: "7 hrs 42 mins" }
    ],
    cache: { hit: false }
};
