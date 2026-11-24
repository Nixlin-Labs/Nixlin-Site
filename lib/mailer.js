const nodemailer = require('nodemailer');

const SERVICE_LABELS = {
  website: 'Website / Landing Page',
  application: 'Web or Mobile Application',
  seo: 'SEO',
  marketing: 'Digital Marketing',
  'not-sure': 'Not sure yet',
};

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP_USER or SMTP_PASS is missing. Email dispatch will be simulated in logs.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function sendInquiryNotification(enquiry) {
  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const submissionDate = new Date().toUTCString();
  const serviceLabel = SERVICE_LABELS[enquiry.service] || enquiry.service;
  const phone = enquiry.phone || 'Not provided';

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[SIMULATED MAIL - TO ADMIN] New ${serviceLabel} enquiry from ${enquiry.name} <${enquiry.email}> at ${submissionDate}`);
    return { simulated: true };
  }

  const text = [
    'New Nixlin project enquiry',
    '',
    `Service: ${serviceLabel}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Mobile / WhatsApp: ${phone}`,
    '',
    'Project details:',
    enquiry.description,
    '',
    `Submitted: ${submissionDate}`,
  ].join('\n');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111814; max-width: 640px; line-height: 1.65;">
      <h2 style="color: #001a0e; margin-bottom: 20px;">New project enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 7px 12px 7px 0; color: #66736d;">Service</td><td style="padding: 7px 0; font-weight: 600;">${escapeHtml(serviceLabel)}</td></tr>
        <tr><td style="padding: 7px 12px 7px 0; color: #66736d;">Name</td><td style="padding: 7px 0;">${escapeHtml(enquiry.name)}</td></tr>
        <tr><td style="padding: 7px 12px 7px 0; color: #66736d;">Email</td><td style="padding: 7px 0;"><a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a></td></tr>
        <tr><td style="padding: 7px 12px 7px 0; color: #66736d;">Mobile / WhatsApp</td><td style="padding: 7px 0;">${escapeHtml(phone)}</td></tr>
      </table>
      <div style="margin-top: 24px; padding: 18px; background: #f2f7f4; border-left: 3px solid #00ca6a; white-space: pre-wrap;">${escapeHtml(enquiry.description)}</div>
      <p style="margin-top: 24px; font-size: 12px; color: #718079;">Submitted ${escapeHtml(submissionDate)}</p>
    </div>
  `;

  return transporter.sendMail({
    from: `${mailFrom}`,
    to: mailTo,
    replyTo: enquiry.email,
    subject: `New ${serviceLabel} enquiry from ${enquiry.name}`,
    text,
    html,
  });
}

async function sendVisitorConfirmation(enquiry) {
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const transporter = createTransporter();
  const serviceLabel = SERVICE_LABELS[enquiry.service] || enquiry.service;

  if (!transporter) {
    console.log(`[SIMULATED MAIL - TO VISITOR] Confirmation sent to: ${enquiry.email}`);
    return { simulated: true };
  }

  const text = `Hi ${enquiry.name},

Thanks for reaching out to Nixlin about ${serviceLabel}.

We received your project details and someone from our team will get back to you as soon as possible.

— Nixlin
Built to move ideas forward.`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #001a0e; max-width: 580px; padding: 32px 24px; line-height: 1.7; background-color: #f7f9f8; border-radius: 8px;">
      <div style="margin-bottom: 24px; font-weight: 700; font-size: 18px; letter-spacing: 0.05em;">NIXLIN</div>
      <p>Hi ${escapeHtml(enquiry.name)},</p>
      <p>Thanks for reaching out to Nixlin about <strong>${escapeHtml(serviceLabel)}</strong>.</p>
      <p>We received your project details and someone from our team will get back to you as soon as possible.</p>
      <div style="border-top: 1px solid #dce8e1; padding-top: 20px; margin-top: 28px;">
        <p style="margin: 0; font-weight: 600;">— Nixlin</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #00a858;">Built to move ideas forward.</p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Nixlin" <${mailFrom}>`,
    to: enquiry.email,
    subject: `We received your ${serviceLabel} enquiry — Nixlin`,
    text,
    html,
  });
}

module.exports = {
  sendInquiryNotification,
  sendVisitorConfirmation,
};
