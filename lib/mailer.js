const nodemailer = require('nodemailer');

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('⚠️ SMTP_USER or SMTP_PASS is missing. Email dispatch will be simulated in logs.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send notification email to the Nixlin inbox
 */
async function sendInquiryNotification(inquiryEmail) {
  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const submissionDate = new Date().toUTCString();

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[SIMULATED MAIL - TO ADMIN] New inquiry from: ${inquiryEmail} at ${submissionDate}`);
    return { simulated: true };
  }

  const mailOptions = {
    from: `"Nixlin Website" <${mailFrom}>`,
    to: mailTo,
    subject: `New Nixlin website inquiry: ${inquiryEmail}`,
    text: `New Nixlin website inquiry\n\nEmail:\n${inquiryEmail}\n\nSubmitted:\n${submissionDate}`,
    html: `
      <div style="font-family: sans-serif; color: #171717; max-width: 600px; line-height: 1.6;">
        <h2 style="color: #062E25; margin-bottom: 16px;">New Website Inquiry</h2>
        <p><strong>Email:</strong> <a href="mailto:${inquiryEmail}">${inquiryEmail}</a></p>
        <p><strong>Submitted:</strong> ${submissionDate}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #888;">Nixlin Website Automation</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send automatic confirmation email to the visitor
 */
async function sendVisitorConfirmation(visitorEmail) {
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || 'nixlinlabs@gmail.com';
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[SIMULATED MAIL - TO VISITOR] Confirmation sent to: ${visitorEmail}`);
    return { simulated: true };
  }

  const plainText = `Hi,

Thanks for reaching out to Nixlin.

We received your message and someone from our team will get back to you as soon as possible.

— Nixlin
Built to move ideas forward.`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #021B16; max-width: 580px; padding: 32px 24px; line-height: 1.7; background-color: #FAFCFA; border-radius: 8px;">
      <div style="margin-bottom: 24px;">
        <span style="font-weight: 700; font-size: 18px; letter-spacing: 0.05em; color: #062E25;">NIXLIN</span>
      </div>
      <p style="font-size: 15px; margin-bottom: 16px;">Hi,</p>
      <p style="font-size: 15px; margin-bottom: 16px;">Thanks for reaching out to Nixlin.</p>
      <p style="font-size: 15px; margin-bottom: 24px;">We received your message and someone from our team will get back to you as soon as possible.</p>
      <div style="border-top: 1px solid #DCEFE3; padding-top: 20px; margin-top: 28px;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0A3D31;">— Nixlin</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #4FAE68;">Built to move ideas forward.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Nixlin" <${mailFrom}>`,
    to: visitorEmail,
    subject: 'We got your message — Nixlin',
    text: plainText,
    html: htmlContent,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = {
  sendInquiryNotification,
  sendVisitorConfirmation,
};
