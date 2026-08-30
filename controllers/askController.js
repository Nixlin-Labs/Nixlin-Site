const { connectToDatabase } = require('../lib/mongodb');
const FAQ = require('../models/FAQ');
const { matchFaq } = require('../lib/faqMatcher');

// Fallback FAQs in case MongoDB is temporarily unreachable
const FALLBACK_FAQS = [
  {
    question: 'What does Nixlin do?',
    answer: 'Nixlin builds practical digital products and services, specializing in web development, application development and search engine optimization (SEO).',
    keywords: ['nixlin', 'services', 'products', 'digital products', 'offer', 'overview', 'capabilities'],
  },
  {
    question: 'What services do you provide?',
    answer: 'Nixlin provides three core services: Web Development, Application Development, and SEO (Search Engine Optimization).',
    keywords: ['services', 'service', 'web development', 'app development', 'application development', 'seo', 'websites', 'apps'],
  },
  {
    question: 'Do you build websites?',
    answer: 'Yes. Nixlin builds modern, responsive, high-performance websites tailored to your team or business goals.',
    keywords: ['website', 'websites', 'web', 'web development', 'landing page', 'frontend'],
  },
  {
    question: 'Do you develop applications?',
    answer: 'Yes. Nixlin provides application development services based on the specific requirements and architecture of the project.',
    keywords: ['app', 'apps', 'application', 'applications', 'mobile app', 'web app', 'software development'],
  },
  {
    question: 'Do you provide SEO services?',
    answer: 'Yes. Nixlin helps improve your search visibility, technical site structure, and discoverability through targeted SEO practices.',
    keywords: ['seo', 'search engine', 'ranking', 'search visibility', 'google search', 'organic traffic'],
  },
  {
    question: 'Who do you work with?',
    answer: 'We work with freelancers, business owners, managers, SMEs, small businesses, and startups looking to turn digital requirements into working solutions.',
    keywords: ['clients', 'customers', 'audience', 'work with', 'businesses', 'startups', 'freelancers', 'smes'],
  },
  {
    question: 'Do you work with small businesses?',
    answer: 'Yes. We frequently partner with small businesses and SMEs to create effective, focused digital tools and web platforms.',
    keywords: ['small business', 'small businesses', 'sme', 'smes', 'local business'],
  },
  {
    question: 'Do you work with freelancers?',
    answer: 'Yes. We collaborate with freelancers and independent professionals to build or scale their digital presence and tools.',
    keywords: ['freelancer', 'freelancers', 'individual', 'solopreneur'],
  },
  {
    question: 'Can startups work with Nixlin?',
    answer: 'Yes. Nixlin helps startups build initial products, web applications, and establish search visibility to move ideas forward.',
    keywords: ['startup', 'startups', 'early stage', 'founders', 'mvp'],
  },
  {
    question: 'How does a project start?',
    answer: 'It usually starts with understanding what you need, what you\'re trying to achieve and where you currently are. From there, we can discuss the right next step.',
    keywords: ['start', 'start a project', 'kickoff', 'workflow', 'process', 'steps'],
  },
  {
    question: 'How long does a project take?',
    answer: 'Project timelines vary depending on scope and complexity. Once we review your requirements, we outline a clear, realistic timeframe.',
    keywords: ['timeline', 'duration', 'weeks', 'months', 'turnaround', 'timeframe', 'how long'],
  },
  {
    question: 'How much does a project cost?',
    answer: 'Pricing depends on the scope, complexity and requirements of the work. Share a little about what you need and Nixlin can discuss the right approach.',
    keywords: ['cost', 'pricing', 'price', 'rate', 'quote', 'budget', 'fees', 'how much'],
  },
  {
    question: 'Can I discuss my idea before starting?',
    answer: 'Absolutely. Reach out through our contact form and we will discuss your concept and explore the best way forward.',
    keywords: ['discuss', 'idea', 'consultation', 'brainstorm', 'advice'],
  },
  {
    question: 'Where is Nixlin based?',
    answer: 'Nixlin operates fully remotely, collaborating with clients and teams worldwide.',
    keywords: ['where', 'location', 'based', 'city', 'country', 'office', 'headquarters', 'remote'],
  },
  {
    question: 'Do you work remotely?',
    answer: 'Yes, Nixlin operates 100% remotely.',
    keywords: ['remote', 'remotely', 'work remotely', 'distributed'],
  },
  {
    question: 'How can I contact Nixlin?',
    answer: 'You can submit your email in the "Say hello" section on this page, or write to nixlinlabs@gmail.com.',
    keywords: ['contact', 'email', 'reach out', 'get in touch', 'inquiry', 'message'],
  },
];

async function handleAskQuestion(req, res, next) {
  try {
    const { question } = req.body || {};

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(200).json({
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

    return res.status(200).json({
      success: true,
      matched: matchResult.matched,
      answer: matchResult.answer,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleAskQuestion,
  FALLBACK_FAQS,
};
