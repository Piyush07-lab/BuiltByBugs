//Logic of Spam filter for hire request

function validateEmail(email) {n
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    return re.test(email);
}

function containsBannedWords(message) {
    const banned = ['buy followers', 'SEO services', 'crypto', 'adult', 'cheap', 'loan'];
    const lowerMsg = message.toLowerCase();
    return banned.some(word => lowerMsg.includes(word));
}

function isValidHireRequest({ name, email, message }) {
    if (!name || !email || !message) return { ok: false, reason: 'Missing fields'};
    if (!validateEmail(email)) return { ok: false, reason: 'Invalid email'};
    if (message.length < 4) return { ok: false, reason: 'Too Short' };
    if (containsBannedWords(message)) return { ok: false, reason: 'Spam detected'};
    return { ok: true };
}

module.exports = { isValidHireRequest };