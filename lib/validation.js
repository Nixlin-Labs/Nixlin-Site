/**
 * Email validation regex following standard RFC 5322 approximation
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_REGEX = /^[+\d][\d\s().-]{6,29}$/;
const ALLOWED_SERVICES = new Set(['website', 'application', 'seo', 'marketing', 'not-sure']);

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

function cleanText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function validateContactSubmission(body) {
  const service = cleanText(body?.service);
  const name = cleanText(body?.name);
  const phone = cleanText(body?.phone);
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const emailValidation = validateEmail(body?.email);

  if (!ALLOWED_SERVICES.has(service)) {
    return { isValid: false, message: 'Choose the service you need.' };
  }
  if (name.length < 2 || name.length > 80) {
    return { isValid: false, message: 'Enter your name using 2 to 80 characters.' };
  }
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return { isValid: false, message: 'Enter a valid mobile or WhatsApp number.' };
  }
  if (description.length < 20 || description.length > 2000) {
    return { isValid: false, message: 'Describe your project using 20 to 2000 characters.' };
  }

  return {
    isValid: true,
    data: {
      service,
      name,
      email: emailValidation.email,
      phone,
      description,
    },
  };
}

module.exports = {
  validateEmail,
  validateContactSubmission,
  isHoneypotTriggered,
};
