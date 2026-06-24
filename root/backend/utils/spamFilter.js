//Logic of Spam filter for hire request

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function containsBannedWords(message) {
    const banned = ['buy followers', 'SEO services', 'crypto', 'adult', 'cheap', 'loan'];
    const lowerMsg = message.toLowerCase();
    return banned.some(word =>
        lowerMsg.includes(
            word.toLowerCase()
        )
    );
}

function isValidHireRequest({ name, email, message }) {

    name = name?.trim();
    email = email?.trim();
    message = message?.trim();

    if (!name || !email || !message) return { ok: false, reason: 'Missing fields' };

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') return { ok: false, reason: 'Invalid field types' };

    if (!validateEmail(email)) return { ok: false, reason: 'Invalid email' };

    if (name.length > 100)
        return { ok: false, reason: 'Name too long' };

    if (name.length < 2)
        return { ok: false, reason: 'Name too short' };

    if (!/^[a-zA-Z\s.'-]+$/.test(name))
        return { ok: false, reason: 'Invalid name' };

    if (email.length > 254)
        return { ok: false, reason: 'Email too long' };

    if (message.length > 5000)
        return { ok: false, reason: 'Message too long' };

    if (containsBannedWords(message)) return { ok: false, reason: 'Spam detected' };

    return { ok: true };
}

module.exports = { isValidHireRequest };