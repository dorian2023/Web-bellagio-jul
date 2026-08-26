/**
 * @file security.js
 * @description Security utilities: XSS escaping, input sanitization, rate limiting, and honeypot validation.
 */

/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS).
 * @param {string} str - Raw input string.
 * @returns {string} - Escaped safe string.
 */
export function escapeHTML(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes generic user text input.
 * @param {string} input 
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 2000);
}

/**
 * Validates email format using RFC 5322 compatible regex.
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates international phone format.
 * @param {string} phone 
 * @returns {boolean}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  return cleanPhone.length >= 7 && cleanPhone.length <= 16 && /^\d+$/.test(cleanPhone);
}

/**
 * Creates an in-memory client-side rate limiter.
 * @param {number} cooldownMs - Minimum time in milliseconds between allowed calls.
 * @returns {() => boolean} - Returns true if allowed, false if rate limited.
 */
export function createRateLimiter(cooldownMs = 30000) {
  let lastExecution = 0;
  return function isAllowed() {
    const now = Date.now();
    if (now - lastExecution < cooldownMs) {
      return false;
    }
    lastExecution = now;
    return true;
  };
}
