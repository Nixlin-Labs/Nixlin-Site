import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { matchFaq } from '@/lib/faqMatcher';
import { FALLBACK_FAQS } from '@/controllers/askController';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { question } = body || {};

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({
        success: true,
        matched: false,
        answer: 'Please enter a question to ask Nixlin.',
      });
    }

    let faqs = [];

    try {
      await connectToDatabase();
      faqs = await FAQ.find({ isActive: true }).lean();
    } catch (dbError) {
      console.warn('Could not retrieve FAQs from MongoDB, using fallback list:', dbError.message);
    }

    if (!faqs || faqs.length === 0) {
      faqs = FALLBACK_FAQS;
    }

    const matchResult = matchFaq(question, faqs);

    return NextResponse.json({
      success: true,
      matched: matchResult.matched,
      answer: matchResult.answer,
    });
  } catch (error) {
    console.error('Ask API error:', error);
    return NextResponse.json(
      {
        success: true,
        matched: false,
        answer: "I don't have a clear answer for that yet. If you'd like, write to nixlinlabs@gmail.com and someone from Nixlin can help.",
      },
      { status: 200 }
    );
  }
}
