/**
 * Multi-model pool manager, health tracker, and response checker for Gemini calls.
 */

import { STREAM_CONFIG } from "../config/aiConfig.js";

const BLOCKED_FINISH_REASONS = new Set([
    "SAFETY",
    "RECITATION",
    "BLOCKLIST",
    "PROHIBITED_CONTENT",
]);

const modelHealth = new Map();

function parseCsvModels(value) {
    return String(value || "")
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
}

/**
 * Builds an ordered, deduplicated list of models from GEMINI_MODEL, GEMINI_MODEL_POOL,
 * and STREAM_CONFIG.MODEL_POOL.
 */
export function getModelPool() {
    const ordered = [
        ...parseCsvModels(process.env.GEMINI_MODEL),
        ...parseCsvModels(process.env.GEMINI_MODEL_POOL),
        ...(Array.isArray(STREAM_CONFIG.MODEL_POOL) ? STREAM_CONFIG.MODEL_POOL : []),
    ];

    const seen = new Set();
    const deduped = [];
    for (const model of ordered) {
        if (!seen.has(model)) {
            seen.add(model);
            deduped.push(model);
        }
    }
    return deduped;
}

/**
 * Returns healthy candidate models in priority order, followed by cooling-down
 * models sorted by earliest cooldown expiry so a fallback path always exists.
 */
export function getCandidateModels() {
    const pool = getModelPool();
    const now = Date.now();
    const healthy = [];
    const cooling = [];

    pool.forEach((model, index) => {
        const entry = modelHealth.get(model);
        const cooldownUntil = entry?.cooldownUntil || 0;
        if (now >= cooldownUntil) {
            healthy.push(model);
        } else {
            cooling.push({ model, cooldownUntil, index });
        }
    });

    cooling.sort((a, b) => a.cooldownUntil - b.cooldownUntil || a.index - b.index);
    return [...healthy, ...cooling.map((item) => item.model)];
}

function extractStatusCode(error) {
    const numeric = Number(error?.status ?? error?.statusCode ?? error?.code);
    if (Number.isInteger(numeric) && numeric >= 400 && numeric < 600) {
        return numeric;
    }

    const msg = String(error?.message || "");
    const match = msg.match(/\b(400|401|403|404|408|429|500|502|503|504)\b/);
    return match ? Number(match[1]) : null;
}

function classifyModelError(error) {
    const status = extractStatusCode(error);
    const code = String(error?.code || "").toUpperCase();
    const msg = String(error?.message || "").toLowerCase();

    const isNotFoundError =
        status === 404 ||
        msg.includes("not_found") ||
        msg.includes("not found") ||
        msg.includes("does not exist") ||
        msg.includes("unknown model") ||
        msg.includes("publisher model") ||
        msg.includes("does not have access") ||
        msg.includes("model is not supported");

    const isQuotaOrCapacityError =
        status === 429 ||
        status === 503 ||
        msg.includes("resource_exhausted") ||
        msg.includes("quota") ||
        msg.includes("rate limit") ||
        msg.includes("too many requests") ||
        msg.includes("capacity") ||
        msg.includes("exhausted") ||
        msg.includes("overloaded") ||
        msg.includes("unavailable") ||
        msg.includes("is out") ||
        msg.includes("temporarily out");

    const isEmptyResponseError =
        code === "EMPTY_RESPONSE" ||
        code === "BLOCKED_RESPONSE" ||
        msg.includes("empty response") ||
        msg.includes("response blocked");

    const isAuthError =
        status === 401 ||
        status === 403 ||
        msg.includes("api key not valid") ||
        msg.includes("permission denied") ||
        msg.includes("unauthenticated") ||
        msg.includes("missing gemini_api_key");

    const isTransientError =
        status === 408 ||
        status === 500 ||
        status === 502 ||
        status === 504 ||
        msg.includes("timeout") ||
        msg.includes("timed out") ||
        msg.includes("econnreset") ||
        msg.includes("etimedout") ||
        msg.includes("fetch failed") ||
        msg.includes("network");

    if (isNotFoundError) {
        return {
            code: "MODEL_NOT_FOUND",
            cooldownMs: STREAM_CONFIG.MODEL_NOT_FOUND_COOLDOWN_MS || 300000,
            retryable: true,
            reason: error?.message || "Model not found or inactive",
            userMessage:
                "The primary AI model is unavailable right now and backup models could not complete the request.",
            lastStatus: "not_found",
        };
    }

    if (isAuthError) {
        return {
            code: "AUTH_ERROR",
            cooldownMs: 0,
            retryable: false,
            reason: error?.message || "Invalid or missing Gemini credentials",
            userMessage:
                "AI service authentication failed. Please check the backend API key configuration.",
            lastStatus: "auth_error",
        };
    }

    if (isQuotaOrCapacityError) {
        return {
            code: "MODEL_QUOTA_EXHAUSTED",
            cooldownMs: STREAM_CONFIG.MODEL_COOLDOWN_MS || 60000,
            retryable: true,
            reason: error?.message || "Model quota or capacity exhausted",
            userMessage:
                "AI models are currently busy or out of capacity. Please retry in a moment.",
            lastStatus: "rate_limited",
        };
    }

    if (isEmptyResponseError) {
        return {
            code: code || "EMPTY_RESPONSE",
            cooldownMs: STREAM_CONFIG.MODEL_COOLDOWN_MS || 60000,
            retryable: true,
            reason: error?.message || "Model returned an empty or blocked response",
            userMessage:
                "The AI returned an incomplete response. Please click Retry to try again.",
            lastStatus: "invalid_response",
        };
    }

    if (isTransientError) {
        return {
            code: "UPSTREAM_TRANSIENT_ERROR",
            cooldownMs: STREAM_CONFIG.MODEL_COOLDOWN_MS || 60000,
            retryable: true,
            reason: error?.message || "Temporary upstream connection failure",
            userMessage:
                "Temporary connection issue reaching the AI service. Please click Retry.",
            lastStatus: "transient_error",
        };
    }

    return {
        code: code || "MODEL_REQUEST_ERROR",
        cooldownMs: 0,
        retryable: false,
        reason: error?.message || "AI request failed",
        userMessage:
            "Unable to process this request with the AI assistant right now. Please try again.",
        lastStatus: "error",
    };
}

/**
 * Resets health tracking for a model after a valid turn.
 */
export function markModelSuccess(model) {
    if (!model) return;
    modelHealth.set(model, {
        failures: 0,
        cooldownUntil: 0,
        lastError: null,
        lastStatus: "healthy",
    });
}

/**
 * Records a model failure, applies cooldown windows, and returns normalized error info.
 */
export function markModelFailure(model, error) {
    const info = classifyModelError(error);
    if (model) {
        const prev = modelHealth.get(model) || {
            failures: 0,
            cooldownUntil: 0,
            lastError: null,
            lastStatus: "healthy",
        };
        modelHealth.set(model, {
            failures: prev.failures + 1,
            cooldownUntil: info.cooldownMs > 0 ? Date.now() + info.cooldownMs : 0,
            lastError: info.reason,
            lastStatus: info.lastStatus,
        });
    }

    return {
        code: info.code,
        userMessage: info.userMessage,
        retryable: info.retryable,
        reason: info.reason,
    };
}

/**
 * Validates that a model turn produced usable text or tool calls without a safety block.
 */
export function validateModelTurnOutput({ text, functionCalls, candidate } = {}) {
    const finishReason = String(candidate?.finishReason || "").toUpperCase();
    if (BLOCKED_FINISH_REASONS.has(finishReason)) {
        return {
            valid: false,
            code: "BLOCKED_RESPONSE",
            reason: `Response blocked (${finishReason})`,
            retryable: true,
        };
    }

    const hasText = String(text || "").trim().length > 0;
    const hasCalls =
        Array.isArray(functionCalls) &&
        functionCalls.some(
            (call) => call && typeof call.name === "string" && call.name.trim().length > 0
        );

    if (!hasText && !hasCalls) {
        return {
            valid: false,
            code: "EMPTY_RESPONSE",
            reason: "Model returned an empty response with no text or tool calls",
            retryable: true,
        };
    }

    return { valid: true };
}

/**
 * Converts a model pool or stream exception into a safe, user-facing error payload.
 */
export function formatManagedError(error) {
    const classified = classifyModelError(error);
    const code = error?.code === "ALL_MODELS_EXHAUSTED" ? error.code : classified.code;

    const message =
        error?.code === "ALL_MODELS_EXHAUSTED"
            ? error.userMessage ||
              "All AI models in the pool are currently busy or unavailable. Please click Retry in a moment."
            : error?.userMessage || classified.userMessage;

    return {
        code,
        message,
        retryable:
            typeof error?.retryable === "boolean"
                ? error.retryable
                : classified.retryable,
    };
}

/**
 * Clears cached model health/cooldown state for a single model or all models.
 */
export function resetModelPoolHealth(model = null) {
    if (model) {
        modelHealth.delete(model);
        return;
    }
    modelHealth.clear();
}
