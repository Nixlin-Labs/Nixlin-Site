/**
 * Nixlin Intelligent FAQ Matching Engine
 * 
 * Compares important semantic terms, intents, stemmed keywords, and synonyms
 * rather than strict full statement comparisons, significantly improving response rate and accuracy.
 */

// Common English Stop Words (to filter out low-value filler words)
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'what',
  'what\'s', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'please', 'tell', 'want', 'like',
  'need', 'give', 'know', 'can'
]);

/**
 * Common conversational phrases and immediate answers
 */
const CONVERSATIONAL_INTENTS = [
  {
    patterns: [/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo|howdy|sup|hola)\b/i],
    answer: "Hello! 👋 How can I help you today? You can ask me about our services (Web Development, Applications, SEO), project timelines, pricing, or how we work with clients.",
  },
  {
    patterns: [/^(who are you|what are you|what is your name|your name)\b/i],
    answer: "I am the Nixlin assistant! I can help answer questions about our digital services (Web Development, Applications, SEO), project timelines, pricing, and how to get started.",
  },
  {
    patterns: [/^(thanks|thank you|thx|appreciate it|great thanks|awesome|perfect|good job|cool)\b/i],
    answer: "You're very welcome! If you have any other questions or would like to explore a project together, feel free to ask or write to nixlinlabs@gmail.com.",
  },
  {
    patterns: [/^(bye|goodbye|see you|take care|cya|exit)\b/i],
    answer: "Goodbye! Have a great day, and feel free to reach out anytime through the contact form or at nixlinlabs@gmail.com.",
  },
  {
    patterns: [/^(help|what can you do|what can i ask|options|menu|commands)\b/i],
    answer: "You can ask me about:\n• Our core services (Web Development, App Development, SEO)\n• Project costs, pricing & estimates\n• Timelines & project turnaround\n• Who we work with (Startups, SMEs, Freelancers)\n• How a project starts & how to contact us",
  },
];

/**
 * Semantic intent clusters to associate related terms with core subjects
 */
const INTENT_CLUSTERS = {
  pricing: [
    'cost', 'costs', 'costing', 'price', 'prices', 'pricing', 'rate', 'rates', 'quote',
    'quotes', 'quotation', 'how much', 'budget', 'budgets', 'fee', 'fees', 'charge',
    'charges', 'expense', 'expensive', 'cheap', 'affordable', 'dollar', 'dollars',
    'usd', 'inr', 'money', 'payment', 'bill', 'billing', 'estimate', 'estimates'
  ],
  timeline: [
    'timeline', 'timelines', 'timeframe', 'duration', 'time', 'times', 'turnaround',
    'deadline', 'deadlines', 'schedule', 'delivery', 'how long', 'weeks', 'months',
    'days', 'hours', 'fast', 'speed', 'quick', 'urgent', 'when'
  ],
  seo: [
    'seo', 'search', 'ranking', 'rankings', 'google', 'visibility', 'traffic',
    'discoverability', 'organic', 'serp', 'keywords', 'optimization', 'optimize',
    'search engine'
  ],
  website: [
    'website', 'websites', 'web', 'site', 'sites', 'webpage', 'webpages',
    'landing page', 'landing pages', 'frontend', 'front end', 'html', 'css',
    'react', 'nextjs', 'next js', 'ui', 'ux', 'web design'
  ],
  application: [
    'app', 'apps', 'application', 'applications', 'mobile', 'software',
    'web app', 'web apps', 'webapp', 'webapps', 'backend', 'fullstack',
    'system', 'systems', 'saas', 'platform', 'platforms', 'tool', 'tools',
    'dashboard', 'develop software'
  ],
  startProject: [
    'start', 'starting', 'begin', 'beginning', 'kickoff', 'onboarding',
    'process', 'first step', 'steps', 'workflow', 'how to start', 'initiate',
    'hire', 'get started', 'collaborate', 'work together'
  ],
  contact: [
    'contact', 'contacts', 'email', 'emails', 'mail', 'reach', 'reach out',
    'get in touch', 'touch', 'write', 'message', 'messages', 'inquiry',
    'inquiries', 'inquire', 'say hello', 'phone', 'call', 'talk to someone'
  ],
  startup: [
    'startup', 'startups', 'founder', 'founders', 'early stage', 'early-stage',
    'mvp', 'prototype', 'seed', 'launch', 'incubator', 'scaleup'
  ],
  smallBusiness: [
    'small business', 'small businesses', 'sme', 'smes', 'smb', 'smbs',
    'local business', 'local businesses', 'enterprise', 'shop', 'store', 'agency'
  ],
  freelancer: [
    'freelancer', 'freelancers', 'freelance', 'individual', 'individuals',
    'independent', 'solopreneur', 'solopreneurs', 'creator', 'creators',
    'contractor', 'consultant'
  ],
  location: [
    'where', 'location', 'locations', 'based', 'city', 'country', 'office',
    'offices', 'headquarters', 'hq', 'place', 'address', 'located'
  ],
  remote: [
    'remote', 'remotely', 'wfh', 'work from home', 'distributed', 'global',
    'worldwide', 'international', 'anywhere'
  ],
  services: [
    'service', 'services', 'offer', 'offers', 'offering', 'provide', 'provides',
    'capabilities', 'specialty', 'specialties', 'expertise', 'do', 'features',
    'what do you do', 'overview'
  ],
  discuss: [
    'discuss', 'idea', 'ideas', 'consultation', 'consult', 'talk', 'call',
    'meeting', 'brainstorm', 'advice', 'advise', 'concept', 'plan', 'strategy'
  ],
  clients: [
    'who', 'who do you work with', 'client', 'clients', 'customer', 'customers',
    'audience', 'target', 'partner', 'partners', 'people', 'companies'
  ]
};

/**
 * Simple English suffix stemmer to unify word variations
 * e.g., 'developing' -> 'develop', 'websites' -> 'websit', 'pricing' -> 'price'
 */
function stemWord(word) {
  if (!word || word.length <= 3) return word;
  
  let stemmed = word.toLowerCase();

  // Common irregular / special case mappings
  const specialCases = {
    'pricing': 'price',
    'prices': 'price',
    'costing': 'cost',
    'costs': 'cost',
    'websites': 'websit',
    'website': 'websit',
    'apps': 'app',
    'application': 'app',
    'applications': 'app',
    'development': 'develop',
    'developing': 'develop',
    'developer': 'develop',
    'developers': 'develop',
    'optimization': 'optimiz',
    'optimizing': 'optimiz',
    'startups': 'startup',
    'businesses': 'busi',
    'business': 'busi',
    'freelancers': 'freelanc',
    'freelancer': 'freelanc',
    'freelancing': 'freelanc',
    'services': 'servic',
    'service': 'servic',
    'timelines': 'timelin',
    'timeline': 'timelin',
    'remotely': 'remot',
    'remote': 'remot',
    'locations': 'locat',
    'location': 'locat',
    'located': 'locat'
  };

  if (specialCases[stemmed]) {
    return specialCases[stemmed];
  }

  // Strip standard English endings
  if (stemmed.endsWith('ing') && stemmed.length > 5) {
    return stemmed.slice(0, -3);
  }
  if (stemmed.endsWith('ies') && stemmed.length > 4) {
    return stemmed.slice(0, -3) + 'y';
  }
  if (stemmed.endsWith('es') && stemmed.length > 4) {
    return stemmed.slice(0, -2);
  }
  if (stemmed.endsWith('s') && !stemmed.endsWith('ss') && stemmed.length > 3) {
    return stemmed.slice(0, -1);
  }
  if (stemmed.endsWith('ed') && stemmed.length > 4) {
    return stemmed.slice(0, -2);
  }
  if (stemmed.endsWith('ment') && stemmed.length > 6) {
    return stemmed.slice(0, -4);
  }
  if (stemmed.endsWith('tion') && stemmed.length > 6) {
    return stemmed.slice(0, -4);
  }

  return stemmed;
}

/**
 * Normalize input string: lowercase, strip punctuation, clean extra spaces
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/['’]/g, '') // keep don't -> dont for cleaner tokenization
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract meaningful semantic tokens (excludes stop words, applies stemming)
 */
function extractTokens(normalizedText) {
  if (!normalizedText) return [];
  const rawWords = normalizedText.split(' ').filter((w) => w.length > 1);
  const meaningfulWords = rawWords.filter((word) => !STOP_WORDS.has(word));
  
  // If all words were stopwords (e.g. "where are you"), fall back to raw words
  const baseList = meaningfulWords.length > 0 ? meaningfulWords : rawWords;

  return baseList.map((w) => ({
    original: w,
    stemmed: stemWord(w),
  }));
}

/**
 * Identify intent clusters present in the user query
 */
function detectIntents(normalizedQuery, tokens) {
  const matchedIntents = new Set();
  const rawTokens = tokens.map((t) => t.original);
  const stemmedTokens = tokens.map((t) => t.stemmed);

  for (const [intentName, terms] of Object.entries(INTENT_CLUSTERS)) {
    for (const term of terms) {
      // Multi-word phrase check (e.g. 'small business', 'how long', 'search engine')
      if (term.includes(' ')) {
        if (normalizedQuery.includes(term)) {
          matchedIntents.add(intentName);
          break;
        }
      } else {
        const stemmedTerm = stemWord(term);
        if (rawTokens.includes(term) || stemmedTokens.includes(stemmedTerm)) {
          matchedIntents.add(intentName);
          break;
        }
      }
    }
  }

  return Array.from(matchedIntents);
}

/**
 * Match a user question against FAQs using term, intent, and keyword intelligence
 * @param {string} userQuestion - The raw question submitted by user
 * @param {Array} faqs - Array of FAQ documents
 * @returns {{ matched: boolean, answer: string, score: number, faq?: object }}
 */
function matchFaq(userQuestion, faqs) {
  if (!userQuestion || typeof userQuestion !== 'string' || userQuestion.trim().length === 0) {
    return {
      matched: false,
      answer: "Please enter a question to ask Nixlin.",
      score: 0,
    };
  }

  const trimmedQuery = userQuestion.trim();
  const normalizedQuery = normalizeText(trimmedQuery);

  // 1. Check instant conversational intents (greetings, thanks, help, who are you)
  for (const intent of CONVERSATIONAL_INTENTS) {
    for (const pattern of intent.patterns) {
      if (pattern.test(trimmedQuery) || pattern.test(normalizedQuery)) {
        return {
          matched: true,
          answer: intent.answer,
          score: 100,
        };
      }
    }
  }

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return {
      matched: false,
      answer: "I don't have a clear answer for that yet. If you'd like, write to nixlinlabs@gmail.com and someone from Nixlin will assist you.",
      score: 0,
    };
  }

  const queryTokens = extractTokens(normalizedQuery);
  const detectedIntents = detectIntents(normalizedQuery, queryTokens);

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqs) {
    let score = 0;
    const normalizedFaqQuestion = normalizeText(faq.question);
    const faqTokens = extractTokens(normalizedFaqQuestion);
    const normalizedFaqAnswer = normalizeText(faq.answer || '');
    const faqAnswerTokens = extractTokens(normalizedFaqAnswer);

    // FAQ Intent detection
    const faqIntents = detectIntents(
      normalizedFaqQuestion + ' ' + (faq.keywords || []).join(' '),
      [...faqTokens, ...extractTokens((faq.keywords || []).join(' '))]
    );

    // 1. Exact match on question
    if (normalizedQuery === normalizedFaqQuestion) {
      score += 40;
    }

    // 2. Substring phrase match on question
    if (normalizedQuery.includes(normalizedFaqQuestion) || (normalizedFaqQuestion.length > 5 && normalizedQuery.length > 5 && normalizedFaqQuestion.includes(normalizedQuery))) {
      score += 25;
    }

    // 3. Intent Cluster Overlap (High relevance)
    for (const intent of detectedIntents) {
      if (faqIntents.includes(intent)) {
        score += 20;
      }
    }

    // 4. Keyword List Matching
    if (Array.isArray(faq.keywords)) {
      for (const kw of faq.keywords) {
        const normalizedKw = normalizeText(kw);
        if (!normalizedKw) continue;

        // Multi-word keyword match in query (e.g. 'search engine', 'app development')
        if (normalizedKw.includes(' ') && normalizedQuery.includes(normalizedKw)) {
          score += 15;
          continue;
        }

        // Token match with keywords
        const stemmedKw = stemWord(normalizedKw);
        for (const qToken of queryTokens) {
          if (qToken.original === normalizedKw) {
            score += 10;
          } else if (qToken.stemmed === stemmedKw) {
            score += 7;
          }
        }
      }
    }

    // 5. Question Terms Token Matching (Stemmed + Original)
    let questionTermHits = 0;
    for (const qToken of queryTokens) {
      for (const fToken of faqTokens) {
        if (qToken.original === fToken.original) {
          score += 8;
          questionTermHits++;
        } else if (qToken.stemmed === fToken.stemmed) {
          score += 6;
          questionTermHits++;
        }
      }
    }

    // Multi-term agreement bonus (e.g. matching "small" + "business" or "project" + "cost")
    if (questionTermHits >= 2) {
      score += 10;
    }

    // 6. Answer Content Term Matching (Supporting context)
    for (const qToken of queryTokens) {
      for (const aToken of faqAnswerTokens) {
        if (qToken.original === aToken.original) {
          score += 2;
        } else if (qToken.stemmed === aToken.stemmed) {
          score += 1.5;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Response threshold: Any clear keyword / intent match will easily score >= 7
  const MATCH_THRESHOLD = 7;

  if (bestMatch && highestScore >= MATCH_THRESHOLD) {
    return {
      matched: true,
      answer: bestMatch.answer,
      score: highestScore,
      faq: bestMatch,
    };
  }

  return {
    matched: false,
    answer: "I don't have a clear answer for that yet. If you'd like, reach out directly at nixlinlabs@gmail.com or send a message via the contact form and someone from Nixlin can help.",
    score: highestScore,
  };
}

module.exports = {
  STOP_WORDS,
  INTENT_CLUSTERS,
  stemWord,
  normalizeText,
  extractTokens,
  detectIntents,
  matchFaq,
};
