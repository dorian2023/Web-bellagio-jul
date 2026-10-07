/**
 * @file security.ts
 * @description Security utilities: XSS escaping, input sanitization, rate limiting, and validation.
 */

/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS).
 */
export function escapeHTML(str: string): string {
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
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 2000);
}

/**
 * Validates email format using RFC 5322 compatible regex.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates international phone format.
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  return cleanPhone.length >= 7 && cleanPhone.length <= 16 && /^\d+$/.test(cleanPhone);
}

/**
 * Creates an in-memory client-side rate limiter.
 */
export function createRateLimiter(cooldownMs = 30000): () => boolean {
  let lastExecution = 0;
  return function isAllowed(): boolean {
    const now = Date.now();
    if (now - lastExecution < cooldownMs) {
      return false;
    }
    lastExecution = now;
    return true;
  };
}
