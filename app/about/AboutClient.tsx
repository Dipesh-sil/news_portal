'use client';

import { useLanguage } from '@/lib/language';
import { Newspaper, Target, Users, Mail } from 'lucide-react';

export default function AboutClient() {
  const { isNepali } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className={`mb-6 text-3xl font-extrabold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
        {isNepali ? 'बुलेट खबरको बारेमा' : 'About Bullet Khabar'}
      </h1>

      <div className="space-y-8">
        {/* Mission */}
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-bk-blue">
            <Target className="h-5 w-5" />
            <h2 className={`text-xl font-bold ${isNepali ? 'nepali-heading' : ''}`}>
              {isNepali ? 'हाम्रो उद्देश्य' : 'Our Mission'}
            </h2>
          </div>
          <p className={isNepali ? 'nepali-text' : 'text-gray-600 leading-relaxed'}>
            {isNepali
              ? 'बुलेट खबर नेपालको सबैभन्दा छिटो द्विभाषी समाचार प्लेटफर्म हो। हामी नेपाली र अंग्रेजी दुवै भाषामा छोटो, सटीक र भरपर्दो समाचार प्रदान गर्दछौं। हाम्रो ३-बुँदे सारांश ढाँचाले तपाईंलाई मिनेटमै मुख्य खबरहरू बुझ्न मद्दत गर्दछ।'
              : 'Bullet Khabar is Nepal\'s fastest bilingual news platform. We deliver concise, accurate, and reliable news in both Nepali and English. Our signature 3-bullet TL;DR format helps you understand key stories in minutes, not hours.'}
          </p>
        </section>

        {/* What We Do */}
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-bk-blue">
            <Newspaper className="h-5 w-5" />
            <h2 className={`text-xl font-bold ${isNepali ? 'nepali-heading' : ''}`}>
              {isNepali ? 'हामी के गर्छौं' : 'What We Do'}
            </h2>
          </div>
          <ul className={`space-y-2 ${isNepali ? 'nepali-text' : 'text-gray-600'}`}>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bk-blue" />
              {isNepali
                ? 'राजनीति, व्यापार, खेलकुद, प्रविधि र विश्व समाचार कभर गर्छौं'
                : 'Cover politics, business, sports, technology, and world news'}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bk-blue" />
              {isNepali
                ? 'हरेक लेखको ३-बुँदे सारांश प्रदान गर्छौं'
                : 'Provide 3-bullet TL;DR summaries for every article'}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bk-blue" />
              {isNepali
                ? 'विप्रेषण दर, रोजगार सूचना र सार्वजनिक सूचनाहरू प्रकाशित गर्छौं'
                : 'Publish remittance rates, job listings, and public notices'}
            </li>
          </ul>
        </section>

        {/* Team */}
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-bk-blue">
            <Users className="h-5 w-5" />
            <h2 className={`text-xl font-bold ${isNepali ? 'nepali-heading' : ''}`}>
              {isNepali ? 'हाम्रो टोली' : 'Our Team'}
            </h2>
          </div>
          <p className={isNepali ? 'nepali-text' : 'text-gray-600 leading-relaxed'}>
            {isNepali
              ? 'बुलेट खबर काठमाडौंमा आधारित पत्रकार, सम्पादक र प्रविधिविद्हरूको टोलीद्वारा सञ्चालित छ।'
              : 'Bullet Khabar is operated by a team of journalists, editors, and technologists based in Kathmandu, Nepal.'}
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-bk-blue">
            <Mail className="h-5 w-5" />
            <h2 className={`text-xl font-bold ${isNepali ? 'nepali-heading' : ''}`}>
              {isNepali ? 'सम्पर्क' : 'Contact Us'}
            </h2>
          </div>
          <p className={isNepali ? 'nepali-text' : 'text-gray-600'}>
            {isNepali ? 'इमेल' : 'Email'}: info@bulletkhabar.com.np
          </p>
          <p className={`mt-1 ${isNepali ? 'nepali-text' : 'text-gray-600'}`}>
            {isNepali ? 'ठेगाना: काठमाडौं, नेपाल' : 'Address: Kathmandu, Nepal'}
          </p>
        </section>
      </div>
    </div>
  );
}
