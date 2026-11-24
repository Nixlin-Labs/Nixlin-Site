import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { validateContactSubmission, isHoneypotTriggered } from '@/lib/validation';
import { sendInquiryNotification, sendVisitorConfirmation } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    // 1. Check honeypot field
    if (isHoneypotTriggered(body)) {
      console.log('Spam honeypot triggered; discarding submission.');
      return NextResponse.json({
        success: true,
        message: 'Thanks — your message is on its way.',
      });
    }

    // 2. Validate and normalize the complete enquiry
    const validation = validateContactSubmission(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    const enquiry = validation.data;

    // 3. Connect to MongoDB & save contact
    try {
      await connectToDatabase();
      await Contact.create({ ...enquiry, status: 'new', source: 'website' });
    } catch (dbError) {
      console.error('Failed to store contact in MongoDB:', dbError.message);
    }

    // 4. Send notification and auto-reply emails
    try {
      await Promise.allSettled([
        sendInquiryNotification(enquiry),
        sendVisitorConfirmation(enquiry),
      ]);
    } catch (mailError) {
      console.error('Mail dispatch error:', mailError.message);
    }

    // 5. Respond with success
    return NextResponse.json({
      success: true,
      message: 'Thanks — your message is on its way.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "We couldn't process that right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
