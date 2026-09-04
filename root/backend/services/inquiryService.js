const { MongoClient } = require("mongodb");
const fsPromises = require("fs").promises;
const path = require("path");

let client = null;
let db = null;

/**
 * Initializes and retrieves the MongoDB database instance.
 * Reuses the existing connection across invocations.
 */
async function getMongoDb() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;

    if (db) return db;

    if (!client) {
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        await client.connect();
        console.log("[InquiryService] Connected to MongoDB.");
    }

    const dbName = process.env.MONGODB_DB_NAME || "portfolio";
    db = client.db(dbName);
    return db;
}

/**
 * Fallback to local JSON files for local development when MONGODB_URI is not set.
 */
async function saveToJsonFallback(fileName, data) {
    const dataDir = path.join(__dirname, "../data");
    const filePath = path.join(dataDir, fileName);

    await fsPromises.mkdir(dataDir, { recursive: true });

    let existing = [];
    try {
        await fsPromises.access(filePath);
        const content = await fsPromises.readFile(filePath, "utf8");
        existing = JSON.parse(content);
        if (!Array.isArray(existing)) existing = [];
    } catch {
        existing = [];
    }

    existing.push(data);

    await fsPromises.writeFile(
        filePath,
        JSON.stringify(existing, null, 2),
        "utf8"
    );
}

/**
 * Persists a hire request either to MongoDB or to local JSON fallback.
 */
async function saveHireRequest(data) {
    const entry = {
        ...data,
        timestamp: new Date().toISOString(),
    };

    const database = await getMongoDb().catch((err) => {
        console.error("[InquiryService] MongoDB connection error:", err.message);
        return null;
    });

    if (database) {
        const collection = database.collection("hire_requests");
        const result = await collection.insertOne(entry);
        return { success: true, id: result.insertedId, storage: "mongodb" };
    }

    console.warn(
        "[InquiryService] MONGODB_URI not set or unreachable. Storing to local JSON fallback."
    );
    await saveToJsonFallback("hire-requests.json", entry);
    return { success: true, storage: "local_json" };
}

/**
 * Persists a contact request either to MongoDB or to local JSON fallback.
 */
async function saveContactRequest(data) {
    const entry = {
        ...data,
        timestamp: new Date().toISOString(),
    };

    const database = await getMongoDb().catch((err) => {
        console.error("[InquiryService] MongoDB connection error:", err.message);
        return null;
    });

    if (database) {
        const collection = database.collection("contact_requests");
        const result = await collection.insertOne(entry);
        return { success: true, id: result.insertedId, storage: "mongodb" };
    }

    console.warn(
        "[InquiryService] MONGODB_URI not set or unreachable. Storing to local JSON fallback."
    );
    await saveToJsonFallback("contact-requests.json", entry);
    return { success: true, storage: "local_json" };
}

module.exports = {
    saveHireRequest,
    saveContactRequest,
};
