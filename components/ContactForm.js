'use client';

import { useState } from 'react';

export default function ContactForm({ inputRef }) {
  const [email, setEmail] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          _gotcha: gotcha,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('error');
        setErrorMessage(data.message || 'Enter a valid email address.');
        return;
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus('error');
      setErrorMessage("We couldn't send that right now. Please try again shortly.");
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 w-full py-16 md:py-24 px-6 sm:px-10 md:px-14 lg:px-20 max-w-7xl mx-auto border-t border-border/30"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Title & Section Label */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-mono-meta text-xs uppercase tracking-[0.25em] text-accent/90 font-medium">
            LET&apos;S TALK
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-primary tracking-tight font-sans">
            Say hello.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-secondary/80 leading-relaxed max-w-md font-light">
            Whether you have a project, an idea or simply want to know more about Nixlin, send a message. We read every one.
          </p>
        </div>

        {/* Right column: Minimal Interaction Field */}
        <div className="lg:col-span-7 w-full max-w-xl">
          {status === 'success' ? (
            <div
              role="status"
              className="p-6 rounded-lg bg-surface/90 border border-accent/40 text-primary flex flex-col gap-2 transition-all duration-300 animate-fadeIn"
            >
              <div className="flex items-center gap-2.5 text-accent font-medium text-base">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Thanks — your message is on its way.</span>
              </div>
              <p className="text-xs text-secondary/80 pl-7 font-mono-meta">
                We received your email and someone from our team will get back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 self-start text-xs font-mono-meta text-accent hover:underline pl-7 cursor-pointer"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Honeypot Spam Field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="form-honeypot">Leave this empty</label>
                <input
                  id="form-honeypot"
                  type="text"
                  name="_gotcha"
                  tabIndex="-1"
                  autoComplete="off"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                />
              </div>

              <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    disabled={status === 'loading'}
                    aria-label="Your email address"
                    className="w-full px-4 py-3.5 rounded-md bg-surface/80 border border-border text-sm text-primary placeholder:text-secondary/50 focus:border-accent focus:bg-surface focus:outline-none transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3.5 rounded-md bg-accent hover:bg-accent/90 text-background-deep font-semibold text-xs tracking-wider uppercase font-mono transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-accent/20"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-background-deep border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Inline Error State */}
              {status === 'error' && (
                <div role="alert" className="text-xs font-mono-meta text-red-400 flex items-center gap-1.5 pt-1 animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-[11px] text-secondary/60 font-mono-meta">
                We never share your email. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
