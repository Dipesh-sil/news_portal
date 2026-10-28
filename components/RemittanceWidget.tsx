'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const RATES = [
  { currency: 'USD', flag: '🇺🇸', name: 'US Dollar', rate: '133.50' },
  { currency: 'INR', flag: '🇮🇳', name: 'Indian Rupee', rate: '1.60' },
  { currency: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal', rate: '35.58' },
  { currency: 'QAR', flag: '🇶🇦', name: 'Qatari Riyal', rate: '36.65' },
];

export default function RemittanceWidget() {
  const { isNepali } = useLanguage();

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-bk-blue" />
        <h3 className={`text-sm font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? 'विप्रेषण दर' : 'Remittance Rates'}
        </h3>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {RATES.map((r) => (
            <tr key={r.currency} className="border-t border-gray-50">
              <td className="py-1.5">
                <span className="mr-1">{r.flag}</span>
                {r.currency}
              </td>
              <td className="py-1.5 text-right font-semibold text-gray-900">
                NPR {r.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        href="/remittance"
        className="mt-3 flex items-center gap-1 text-xs font-medium text-bk-blue hover:underline"
      >
        {isNepali ? 'सबै दरहरू हेर्नुहोस्' : 'View All Rates'}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
