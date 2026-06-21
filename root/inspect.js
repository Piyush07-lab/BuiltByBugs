
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const filePath = path.join(
    __dirname,
    "frontend/js/API-fetch.js"
);

const code = fs.readFileSync(filePath, "utf8");

const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
});

console.log("\n=== API CALLS ===\n");

traverse(ast, {
    CallExpression(path) {

        const { callee } = path.node;

        // fetch(...)
        if (
            callee.type === "Identifier" &&
            callee.name === "fetch"
        ) {
            console.dir(path.node, {
                depth: null,
                colors: true
            });
        }
    }
});