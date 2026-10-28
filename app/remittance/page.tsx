import { Metadata } from 'next';
import RemittanceClient from './RemittanceClient';

export const metadata: Metadata = {
  title: 'Remittance Rates | विप्रेषण दर',
  description: 'Live exchange rates for Nepali Rupee. USD, EUR, GBP, AUD, INR, SAR, QAR, MYR, JPY, KRW to NPR.',
};

export default function RemittancePage() {
  return <RemittanceClient />;
}
