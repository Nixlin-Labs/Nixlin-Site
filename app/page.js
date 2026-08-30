'use client';

import { useState, useEffect, useRef } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import AskRail from '../components/AskRail';

export default function Home() {
  const [isAskRailOpen, setIsAskRailOpen] = useState(false);
  const contactInputRef = useRef(null);

  // Global keyboard shortcut: '/' opens AskRail when not typing in an input/textarea
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/' && !isAskRailOpen) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = document.activeElement?.isContentEditable;
        if (activeTag !== 'input' && activeTag !== 'textarea' && !isEditable) {
          e.preventDefault();
          setIsAskRailOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAskRailOpen]);

  const handleFocusContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        contactInputRef.current?.focus();
      }, 400);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-accent selection:text-background-deep">
      {/* Dynamic Background System */}
      <Background />

      {/* Main Page Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenAskRail={() => setIsAskRailOpen(true)} />

        <main className="flex-1 flex flex-col justify-center">
          <Hero
            onOpenAskRail={() => setIsAskRailOpen(true)}
            onFocusContact={handleFocusContact}
          />
          <ContactForm inputRef={contactInputRef} />
        </main>

        <Footer />
      </div>

      {/* Ask Nixlin Conversational Rail */}
      <AskRail
        isOpen={isAskRailOpen}
        onClose={() => setIsAskRailOpen(false)}
        onFocusContact={handleFocusContact}
      />
    </div>
  );
}
