/**
 * Email validation regex following standard RFC 5322 approximation
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email address is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { isValid: false, message: 'Enter a valid email address.' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, message: 'Email address must not exceed 254 characters.' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Enter a valid email address.' };
  }

  return { isValid: true, email: trimmed };
}

function isHoneypotTriggered(body) {
  // Check for common honeypot field names
  const honeypot = body?._gotcha || body?.honeypot || body?.hp;
  return Boolean(honeypot && String(honeypot).trim().length > 0);
}

module.exports = {
  validateEmail,
  isHoneypotTriggered,
};
