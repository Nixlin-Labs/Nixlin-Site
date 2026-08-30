const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nixlin';

const seedFaqs = [
  // Services
  {
    question: 'What does Nixlin do?',
    answer: 'Nixlin builds practical digital products and services, specializing in web development, application development and search engine optimization (SEO).',
    keywords: ['do', 'about', 'what is', 'offer', 'provide', 'specialty', 'overview', 'company'],
    category: 'services',
    isActive: true,
  },
  {
    question: 'What services do you provide?',
    answer: 'Nixlin provides three core services: Web Development, Application Development, and Search Engine Optimization (SEO).',
    keywords: ['services', 'service', 'web development', 'app development', 'application development', 'seo', 'websites', 'apps'],
    category: 'services',
    isActive: true,
  },
  {
    question: 'Do you build websites?',
    answer: 'Yes. Nixlin builds modern, responsive, high-performance websites tailored to your team or business goals.',
    keywords: ['website', 'websites', 'web', 'web development', 'site', 'build website', 'landing page', 'frontend'],
    category: 'services',
    isActive: true,
  },
  {
    question: 'Do you develop applications?',
    answer: 'Yes. Nixlin provides application development services based on the requirements and architecture of the project.',
    keywords: ['app', 'apps', 'application', 'applications', 'mobile app', 'web app', 'software', 'develop', 'system'],
    category: 'services',
    isActive: true,
  },
  {
    question: 'Do you provide SEO services?',
    answer: 'Yes. Nixlin helps improve your search visibility, technical site structure, and discoverability through targeted SEO practices.',
    keywords: ['seo', 'search', 'search engine', 'ranking', 'visibility', 'google', 'traffic', 'optimization', 'organic'],
    category: 'services',
    isActive: true,
  },

  // Customers
  {
    question: 'Who do you work with?',
    answer: 'We work with freelancers, business owners, managers, SMEs, small businesses, and startups looking to turn digital requirements into working solutions.',
    keywords: ['who', 'clients', 'customers', 'audience', 'work with', 'businesses', 'startups', 'freelancers', 'smes', 'teams'],
    category: 'customers',
    isActive: true,
  },
  {
    question: 'Do you work with small businesses?',
    answer: 'Yes. We frequently partner with small businesses and SMEs to create effective, focused digital tools and web platforms.',
    keywords: ['small business', 'small businesses', 'sme', 'smes', 'local business', 'company'],
    category: 'customers',
    isActive: true,
  },
  {
    question: 'Do you work with freelancers?',
    answer: 'Yes. We collaborate with freelancers and independent professionals to build or scale their digital presence and tools.',
    keywords: ['freelancer', 'freelancers', 'individual', 'independent', 'solopreneur'],
    category: 'customers',
    isActive: true,
  },
  {
    question: 'Can startups work with Nixlin?',
    answer: 'Yes. Nixlin helps startups build initial products, web applications, and establish search visibility to move ideas forward.',
    keywords: ['startup', 'startups', 'early stage', 'founders', 'mvp', 'launch'],
    category: 'customers',
    isActive: true,
  },

  // Projects
  {
    question: 'How does a project start?',
    answer: 'It usually starts with understanding what you need, what you\'re trying to achieve and where you currently are. From there, we can discuss the right next step.',
    keywords: ['start', 'how to start', 'process', 'kickoff', 'beginning', 'first step', 'steps', 'workflow', 'onboarding'],
    category: 'projects',
    isActive: true,
  },
  {
    question: 'How long does a project take?',
    answer: 'Project timelines vary depending on scope and complexity. Once we review your requirements, we outline a clear, realistic timeframe.',
    keywords: ['timeline', 'how long', 'duration', 'time', 'weeks', 'months', 'turnaround', 'delivery', 'schedule'],
    category: 'projects',
    isActive: true,
  },
  {
    question: 'How much does a project cost?',
    answer: 'Pricing depends on the scope, complexity and requirements of the work. Share a little about what you need and Nixlin can discuss the right approach.',
    keywords: ['cost', 'price', 'pricing', 'rate', 'quote', 'how much', 'budget', 'fees', 'estimate'],
    category: 'projects',
    isActive: true,
  },
  {
    question: 'Can I discuss my idea before starting?',
    answer: 'Absolutely. Reach out through our contact form and we will discuss your concept and explore the best way forward.',
    keywords: ['discuss', 'idea', 'consultation', 'talk', 'meeting', 'brainstorm', 'advice'],
    category: 'projects',
    isActive: true,
  },

  // Location
  {
    question: 'Where is Nixlin based?',
    answer: 'Nixlin operates fully remotely, collaborating with clients and teams worldwide.',
    keywords: ['where', 'location', 'based', 'city', 'country', 'office', 'headquarters', 'remote', 'address'],
    category: 'location',
    isActive: true,
  },
  {
    question: 'Do you work remotely?',
    answer: 'Yes, Nixlin operates 100% remotely.',
    keywords: ['remote', 'remotely', 'work from home', 'distributed', 'international'],
    category: 'location',
    isActive: true,
  },

  // Contact
  {
    question: 'How can I contact Nixlin?',
    answer: 'You can submit your email in the "Say hello" section on this page, or write to nixlinlabs@gmail.com.',
    keywords: ['contact', 'email', 'reach out', 'get in touch', 'touch', 'hello', 'message', 'inquiry'],
    category: 'contact',
    isActive: true,
  },
  {
    question: 'How do I start a project?',
    answer: 'Enter your email in the "Say hello" form below or ask a question here. We\'ll follow up promptly to discuss your goals.',
    keywords: ['start project', 'hire', 'begin', 'work together', 'collaborate'],
    category: 'contact',
    isActive: true,
  },
];

async function runSeed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing FAQs...');
    await FAQ.deleteMany({});

    console.log(`Inserting ${seedFaqs.length} FAQs...`);
    await FAQ.insertMany(seedFaqs);

    console.log('✅ Successfully seeded FAQs in MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed FAQs:', error.message);
    process.exit(1);
  }
}

runSeed();
