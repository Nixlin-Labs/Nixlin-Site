'use client';

import { useEffect, useRef, useState } from 'react';

const SERVICE_OPTIONS = [
  { value: 'website', label: 'Website / Landing Page' },
  { value: 'application', label: 'Web or Mobile Application' },
  { value: 'seo', label: 'SEO' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'not-sure', label: 'Not sure yet' },
];

const INITIAL_FORM = { service: '', name: '', email: '', phone: '', description: '' };

export default function ContactForm({ inputRef }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [gotcha, setGotcha] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceDropdownRef = useRef(null);
  const selectedService = SERVICE_OPTIONS.find((option) => option.value === form.service);

  useEffect(() => {
    const closeDropdown = (event) => {
      const dropdown = serviceDropdownRef.current;
      const eventPath = typeof event.composedPath === 'function' ? event.composedPath() : [];
      const happenedInside = eventPath.length > 0
        ? eventPath.includes(dropdown)
        : dropdown?.contains(event.target);

      if (!happenedInside) {
        setIsServiceOpen(false);
      }
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'loading') return;

    if (!form.service || !form.name.trim() || !form.email.trim() || !form.description.trim()) {
      setStatus('error');
      setErrorMessage('Choose a service and complete the required fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          description: form.description.trim(),
          _gotcha: gotcha,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus('error');
        setErrorMessage(data.message || 'Check your details and try again.');
        return;
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus('error');
      setErrorMessage("We couldn't send that right now. Please try again shortly.");
    }
  };

  return (
    <section id="contact" className="relative z-10 mx-auto w-full max-w-7xl border-t border-border/25 px-6 py-20 sm:px-10 md:px-14 md:py-28 lg:px-20">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-5 bg-accent/50" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-accent/80">Contact</span>
          </div>
          <h2 className="text-3xl font-normal tracking-tight text-primary sm:text-4xl md:text-5xl">Say hello.</h2>
          <p className="max-w-md text-[15px] font-light leading-[1.75] text-secondary/75 sm:text-base">
            Tell us what you want to build, improve or grow. We read every project enquiry and reply with a clear next step.
          </p>
        </div>

        <div className="flex w-full flex-col gap-5 lg:col-span-7 lg:pt-9">
          <h3 className="text-xl font-medium tracking-tight text-primary sm:text-2xl">Start your project.</h3>

          {status === 'success' ? (
            <div role="status" className="flex flex-col gap-2 rounded-lg border border-accent/40 bg-surface/70 p-6 text-primary transition-all duration-300 animate-fadeIn">
              <div className="flex items-center gap-2.5 text-base font-medium text-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Thanks — your project details are on their way.</span>
              </div>
              <p className="pl-7 text-xs text-secondary/80">We received your enquiry and will get back to you as soon as possible.</p>
              <button type="button" onClick={() => setStatus('idle')} className="mt-4 self-start pl-7 font-mono text-xs text-accent hover:underline">
                Send another enquiry →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="form-honeypot">Leave this empty</label>
                <input id="form-honeypot" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" value={gotcha} onChange={(event) => setGotcha(event.target.value)} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div ref={serviceDropdownRef} className="relative flex flex-col gap-2 text-xs text-secondary/80">
                  <span>What do you need? <span className="text-accent">*</span></span>
                  <button
                    ref={inputRef}
                    type="button"
                    role="combobox"
                    aria-controls="service-options"
                    aria-expanded={isServiceOpen}
                    aria-haspopup="listbox"
                    onClick={() => setIsServiceOpen((open) => !open)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setIsServiceOpen(false);
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setIsServiceOpen(true);
                      }
                    }}
                    className={`contact-field flex min-h-12 w-full touch-manipulation cursor-pointer items-center justify-between gap-3 rounded-md border bg-surface/60 px-4 text-left text-sm transition-colors hover:bg-surface/80 focus:bg-surface ${isServiceOpen ? 'border-accent' : 'border-border/50'}`}
                  >
                    <span className={selectedService ? 'text-primary' : 'text-secondary/40'}>
                      {selectedService?.label || 'Select a service'}
                    </span>
                    <svg
                      className={`h-4 w-4 flex-none text-accent transition-transform duration-200 ${isServiceOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {isServiceOpen && (
                    <div
                      id="service-options"
                      role="listbox"
                      aria-label="Service options"
                      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-border-strong bg-[#06120D] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] animate-fadeIn"
                    >
                      {SERVICE_OPTIONS.map((option) => {
                        const isSelected = form.service === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              updateField('service', option.value);
                              setIsServiceOpen(false);
                            }}
                            className={`flex min-h-10 w-full touch-manipulation items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'bg-accent/12 text-accent' : 'text-secondary hover:bg-surface-muted hover:text-primary'}`}
                          >
                            <span>{option.label}</span>
                            {isSelected && <span aria-hidden="true">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <label className="flex flex-col gap-2 text-xs text-secondary/80">
                  <span>Your name <span className="text-accent">*</span></span>
                  <input type="text" name="name" autoComplete="name" maxLength={80} value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Your name" className="contact-field min-h-12 rounded-md border border-border/50 bg-surface/60 px-4 text-sm text-primary placeholder:text-secondary/40 transition-colors hover:bg-surface/80 focus:border-accent focus:bg-surface" />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs text-secondary/80">
                  <span>Email address <span className="text-accent">*</span></span>
                  <input type="email" name="email" autoComplete="email" maxLength={254} value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" className="contact-field min-h-12 rounded-md border border-border/50 bg-surface/60 px-4 text-sm text-primary placeholder:text-secondary/40 transition-colors hover:bg-surface/80 focus:border-accent focus:bg-surface" />
                </label>
                <label className="flex flex-col gap-2 text-xs text-secondary/80">
                  <span>Mobile / WhatsApp <span className="text-secondary/45">— optional</span></span>
                  <input type="tel" name="phone" autoComplete="tel" maxLength={30} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+91 98765 43210" className="contact-field min-h-12 rounded-md border border-border/50 bg-surface/60 px-4 text-sm text-primary placeholder:text-secondary/40 transition-colors hover:bg-surface/80 focus:border-accent focus:bg-surface" />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs text-secondary/80">
                <span>Tell us about your project <span className="text-accent">*</span></span>
                <textarea name="description" rows={5} maxLength={2000} value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="What are you looking to build, improve or launch?" className="contact-field min-h-32 resize-y rounded-md border border-border/50 bg-surface/60 px-4 py-3 text-sm leading-relaxed text-primary placeholder:text-secondary/40 transition-colors hover:bg-surface/80 focus:border-accent focus:bg-surface" />
              </label>

              {status === 'error' && (
                <div role="alert" className="flex items-center gap-1.5 font-mono text-xs text-red-400 animate-fadeIn">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-secondary/50">Your details stay private. No spam, ever.</p>
                <button type="submit" disabled={status === 'loading'} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-background-deep transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_8px_24px_rgba(0,252,137,0.16)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50">
                  {status === 'loading' ? (
                    <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background-deep border-t-transparent" /><span>Sending...</span></>
                  ) : (
                    <><span>Send</span><span aria-hidden="true">→</span></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
