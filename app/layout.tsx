import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationTracker from '@/components/LocationTracker';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: '--font-nepali',
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bulletkhabar.pages.dev'),
  title: {
    default: 'Bullet Khabar | बुलेट खबर - Nepal\'s Fastest Bilingual News',
    template: '%s | Bullet Khabar',
  },
  description:
    'Nepal\'s fastest bilingual news platform. Get breaking news, politics, business, sports, and technology updates in English and Nepali with 3-bullet TL;DR summaries.',
  keywords: ['Nepal news', 'Nepali news', 'bilingual news', 'बुलेट खबर', 'नेपाल समाचार'],
  authors: [{ name: 'Bullet Khabar' }],
  openGraph: {
    type: 'website',
    locale: 'ne_NP',
    alternateLocale: 'en_US',
    url: 'https://bulletkhabar.com.np',
    siteName: 'Bullet Khabar',
    title: 'Bullet Khabar | बुलेट खबर',
    description: 'Nepal\'s fastest bilingual news platform.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bullet Khabar | बुलेट खबर',
    description: 'Nepal\'s fastest bilingual news platform.',
  },
  robots: { index: true, follow: true },
  alternates: {
    languages: { ne: '/', en: '/' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" className={`${inter.variable} ${notoDevanagari.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bk-light antialiased">
        <Providers>
          <LocationTracker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
