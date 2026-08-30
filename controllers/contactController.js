const { connectToDatabase } = require('../lib/mongodb');
const Contact = require('../models/Contact');
const { validateEmail, isHoneypotTriggered } = require('../lib/validation');
const { sendInquiryNotification, sendVisitorConfirmation } = require('../lib/mailer');

async function handleContactSubmission(req, res, next) {
  try {
    // 1. Check honeypot field
    if (isHoneypotTriggered(req.body)) {
      // Silently discard spam submission and return success to mislead bots
      console.log('Spam honeypot triggered; discarding submission.');
      return res.status(200).json({
        success: true,
        message: 'Thanks — your message is on its way.',
      });
    }

    // 2. Validate email
    const { email } = req.body || {};
    const validation = validateEmail(email);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // 3. Connect to MongoDB & save contact
    try {
      await connectToDatabase();
      await Contact.create({
        email: validation.email,
        status: 'new',
        source: 'website',
      });
    } catch (dbError) {
      console.error('Failed to store contact in MongoDB:', dbError.message);
      // If DB error is not a duplicate key error, we still proceed or log
    }

    // 4. Send notification and auto-reply emails in the background
    Promise.allSettled([
      sendInquiryNotification(validation.email),
      sendVisitorConfirmation(validation.email),
    ]).then((results) => {
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.error(`Email dispatch ${idx} failed:`, result.reason?.message || result.reason);
        }
      });
    });

    // 5. Respond with success
    return res.status(200).json({
      success: true,
      message: 'Thanks — your message is on its way.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleContactSubmission,
};
