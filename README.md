<div align="center">

  <h1>NIXLIN</h1>
  <p><strong>Software Products & Digital Services</strong></p>
  <p><em>Built to move ideas forward.</em></p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
    <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  </p>

</div>

---

## ✦ Overview

**Nixlin** is the official web application and digital presence for the Nixlin studio. Built with an editorial dark aesthetic and modern full-stack architecture, it provides an interactive portfolio, a frictionless contact mechanism with automated email workflows, and an intelligent intent-driven conversational assistant.

### 🌟 Core Capabilities
- **Web Development**: Bespoke, high-performance web applications and landing experiences.
- **Application Development**: Scalable full-stack software architecture and product engineering.
- **SEO & Discoverability**: Technical site optimization, search indexing, and organic growth strategies.

---

## ✨ Features

- **🎨 Editorial Aesthetic & Design System**:
  - Curated palette (`#021B16`, `#062E25`, `#4FAE68`) with subtle atmospheric glow effects.
  - Typography blending: *Instrument Serif* (editorial display), *Inter* (interface readability), and *IBM Plex Mono* (technical accents).
  - Responsive layouts, micro-interactions, and accessible keyboard navigability.

- **🤖 Intelligent "Ask Nixlin" Assistant**:
  - Slide-over conversational drawer accessible globally via the <kbd>/</kbd> keyboard shortcut.
  - **Smart Term & Intent Matching Engine**: Multi-tiered semantic scoring that extracts key intents, applies English word stemming, recognizes synonyms, and delivers instant, accurate answers without requiring exact phrase matches.
  - Built-in conversational handling for greetings, identities, thanks, and help queries.

- **📬 Frictionless Contact Inquiries & Mail Dispatch**:
  - One-field streamlined visitor contact form.
  - Honeypot spam defense (`_gotcha` field) and IP rate limiting.
  - Dual automated email dispatch: Admin inquiry notification + visitor receipt confirmation via Nodemailer.
  - Safe fallback simulation mode when SMTP credentials are not configured.

- **🛡️ Resilience & High Availability**:
  - MongoDB database integration with automated in-memory FAQ fallbacks ensuring 100% uptime even during database maintenance.
  - Centralized Express 5 error-handling middleware.

---

## 🏗️ Architecture & Technology Stack

```text
Browser Client
      │
      ▼
Next.js 16 (React 19, Tailwind CSS v4, App Router)
      │
      ▼
Custom Express 5 Server (server/server.js)
      │
      ├── POST /api/contact ──► Contact Controller ──► Nodemailer (Gmail SMTP)
      │
      └── POST /api/ask     ──► Ask Controller     ──► Intent Matcher (lib/faqMatcher.js)
                                                           │
                                                           ├── MongoDB (models/FAQ.js)
                                                           └── In-Memory Fallback FAQs
```

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router) & React 19 |
| **Styling** | Tailwind CSS v4 & PostCSS |
| **Typography** | `Instrument Serif`, `Inter`, `IBM Plex Mono` (Google Fonts via `next/font`) |
| **Server Engine** | Node.js with Express 5 |
| **Database** | MongoDB with Mongoose ODM |
| **Email Delivery** | Nodemailer with Gmail SMTP / App Passwords |
| **Security & Utilities** | `cors`, `express-rate-limit`, `dotenv`, `cross-env` |

---

## 📁 Project Structure

```text
OfficialSite/
├── app/
│   ├── favicon.ico          # Browser icon
│   ├── globals.css          # Design system tokens & utility styling
│   ├── layout.js            # Root layout, metadata & typography
│   ├── logo.png             # Official Nixlin brand logo
│   └── page.js              # Home view & layout orchestration
├── components/
│   ├── AskRail.js           # Slide-over conversational assistant UI
│   ├── Background.js        # Dynamic radial glow background effect
│   ├── ContactForm.js       # Minimal contact submission form
│   ├── Footer.js            # Studio footer with legal & direct contact
│   ├── Header.js            # Top navigation bar & Ask trigger
│   ├── Hero.js              # Editorial headline & capabilities overview
│   └── Logo.js              # Next.js Image-optimized logo component
├── controllers/
│   ├── askController.js     # Chatbot FAQ query handler & fallback data
│   └── contactController.js # Contact form validation & email orchestration
├── lib/
│   ├── faqMatcher.js        # Term-matching, stemming & intent engine
│   ├── mailer.js            # Nodemailer transport & email HTML templates
│   └── mongodb.js           # Cached MongoDB connection manager
├── middleware/
│   ├── errorHandler.js      # Centralized error handler
│   └── rateLimiter.js       # IP rate limiter for API protection
├── models/
│   ├── Contact.js           # Mongoose schema for contact inquiries
│   └── FAQ.js               # Mongoose schema for knowledge base
├── routes/
│   ├── askRoutes.js         # /api/ask route definition
│   └── contactRoutes.js     # /api/contact route definition
├── scripts/
│   └── seedFaqs.js          # MongoDB knowledge base seeding script
├── server/
│   └── server.js            # Custom Express 5 server configuration
├── .env.example             # Environment variable template
├── package.json             # Scripts & dependency definitions
└── README.md                # Repository documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/nixlin/official-site.git
cd official-site
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nixlin

# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nixlinlabs@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM=nixlinlabs@gmail.com
MAIL_TO=nixlinlabs@gmail.com
```

> **Note**: For Gmail SMTP, generate a dedicated **[Google App Password](https://myaccount.google.com/apppasswords)**. If credentials are left blank, email deliveries are safely logged to the development console.

### 4. Seed FAQ Knowledge Base
Initialize the MongoDB database with default studio FAQs:
```bash
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the custom Express server in development mode with hot-reloading |
| `npm run build` | Compiles the production-optimized Next.js frontend bundle |
| `npm run start` | Launches the production server (`NODE_ENV=production`) |
| `npm run seed` | Seeds initial FAQ dataset into MongoDB |
| `npm run lint` | Runs ESLint to check code formatting and best practices |

---

## 📡 API Reference

### 1. Contact Form Submission
- **Endpoint**: `POST /api/contact`
- **Rate Limit**: 5 submissions per 15 minutes per IP
- **Payload**:
  ```json
  {
    "email": "hello@example.com",
    "_gotcha": ""
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Thanks — your message is on its way."
  }
  ```

### 2. Conversational FAQ Assistant
- **Endpoint**: `POST /api/ask`
- **Rate Limit**: 30 queries per 15 minutes per IP
- **Payload**:
  ```json
  {
    "question": "How much does a project cost?"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "matched": true,
    "answer": "Pricing depends on the scope, complexity and requirements of the work. Share a little about what you need and Nixlin can discuss the right approach."
  }
  ```

---

## ⌨️ Accessibility & Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>/</kbd> | Open the **Ask Nixlin** conversational drawer from anywhere on the page |
| <kbd>ESC</kbd> | Dismiss and close the conversational drawer |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Navigate focusable inputs and buttons with high-contrast indicator rings |

---

## 📬 Contact & Support

- **Email**: [nixlinlabs@gmail.com](mailto:nixlinlabs@gmail.com)
- **Website**: [nixlin.com](https://nixlin.com)

---

<div align="center">
  <small>© 2026 Nixlin. All rights reserved.</small>
</div>
