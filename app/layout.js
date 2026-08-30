import { Instrument_Serif, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Nixlin — Software Products & Digital Services',
  description: 'Nixlin builds websites, applications and digital growth solutions for freelancers, teams and growing businesses.',
  keywords: ['software development', 'web development', 'application development', 'SEO', 'Nixlin', 'digital products'],
  authors: [{ name: 'Nixlin' }],
  creator: 'Nixlin',
  publisher: 'Nixlin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://nixlin.com'),
  openGraph: {
    title: 'Nixlin — Software Products & Digital Services',
    description: 'Nixlin builds practical digital products and services for people and businesses looking to move their ideas forward.',
    url: 'https://nixlin.com',
    siteName: 'Nixlin',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nixlin — Software Products & Digital Services',
    description: 'Nixlin builds practical digital products and services for people and businesses looking to move their ideas forward.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-background text-primary antialiased selection:bg-accent selection:text-background-deep font-sans overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
