'use client';

import { useLanguage } from '@/lib/language';
import { TrendingUp } from 'lucide-react';

const RATES = [
  { currency: 'USD', flag: '🇺🇸', name: 'US Dollar', nameNp: 'अमेरिकी डलर', buy: '133.50', sell: '134.10' },
  { currency: 'EUR', flag: '🇪🇺', name: 'Euro', nameNp: 'यूरो', buy: '145.20', sell: '145.80' },
  { currency: 'GBP', flag: '🇬🇧', name: 'British Pound', nameNp: 'बेलायती पाउन्ड', buy: '168.30', sell: '168.90' },
  { currency: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', nameNp: 'अष्ट्रेलियन डलर', buy: '87.40', sell: '87.90' },
  { currency: 'INR', flag: '🇮🇳', name: 'Indian Rupee', nameNp: 'भारतीय रुपैयाँ', buy: '1.60', sell: '1.60' },
  { currency: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal', nameNp: 'साउदी रियाल', buy: '35.58', sell: '35.80' },
  { currency: 'QAR', flag: '🇶🇦', name: 'Qatari Riyal', nameNp: 'कतारी रियाल', buy: '36.65', sell: '36.85' },
  { currency: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit', nameNp: 'मलेसियन रिंगिट', buy: '30.20', sell: '30.50' },
  { currency: 'JPY', flag: '🇯🇵', name: 'Japanese Yen (100)', nameNp: 'जापानी येन (१००)', buy: '88.50', sell: '89.00' },
  { currency: 'KRW', flag: '🇰🇷', name: 'Korean Won (100)', nameNp: 'कोरियाली वन (१००)', buy: '9.75', sell: '9.85' },
];

export default function RemittanceClient() {
  const { isNepali } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-bk-blue" />
        <h1 className={`text-3xl font-extrabold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? 'विप्रेषण दर' : 'Remittance Rates'}
        </h1>
      </div>
      <p className={`mb-6 text-gray-500 ${isNepali ? 'nepali-text' : ''}`}>
        {isNepali
          ? 'नेपाल राष्ट्र बैंकको आजको विनिमय दर (सूचक मात्र)।'
          : 'Today\'s exchange rates from Nepal Rastra Bank (indicative only).'}
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
              <th className="px-4 py-3">{isNepali ? 'मुद्रा' : 'Currency'}</th>
              <th className="px-4 py-3 text-right">{isNepali ? 'किन्ने दर (NPR)' : 'Buy (NPR)'}</th>
              <th className="px-4 py-3 text-right">{isNepali ? 'बेच्ने दर (NPR)' : 'Sell (NPR)'}</th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((r) => (
              <tr key={r.currency} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{r.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">{r.currency}</div>
                      <div className={`text-xs text-gray-500 ${isNepali ? 'nepali-heading' : ''}`}>
                        {isNepali ? r.nameNp : r.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{r.buy}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{r.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        {isNepali
          ? 'अन्तिम अपडेट: सूचक दर मात्र। वास्तविक दरहरू भिन्न हुन सक्छन्।'
          : 'Last updated: Indicative rates only. Actual rates may vary.'}
      </p>
    </div>
  );
}
