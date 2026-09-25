import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

/*
 * Cormorant Garamond for headings: a high-contrast display serif that suits
 * "Travel in Style". It is light at 400, so headings use 600.
 * Manrope for text: open and very legible at small sizes (cards, forms, the
 * dashboard), where the original's Jost read small and tight.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-face',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans-face',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Holidaybank Expeditions: Kenyan getaways, East African safaris and international escapes',
    template: '%s | Holidaybank Expeditions',
  },
  description:
    'Kenyan getaways, safari adventures across East Africa, and handpicked international escapes, planned from Nairobi.',
  openGraph: {
    type: 'website',
    siteName: 'Holidaybank Expeditions',
    images: [{ url: '/images/mara-leopard-branch.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before hydration. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
