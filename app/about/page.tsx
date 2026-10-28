import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | हाम्रो बारेमा',
  description: 'About Bullet Khabar - Nepal\'s fastest bilingual news platform.',
};

export default function AboutPage() {
  return <AboutClient />;
}
