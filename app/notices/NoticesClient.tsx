'use client';

import { useLanguage } from '@/lib/language';
import { Bell } from 'lucide-react';
import type { Notice } from '@/lib/posts';

interface Props {
  notices: Notice[];
}

export default function NoticesClient({ notices }: Props) {
  const { isNepali } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Bell className="h-6 w-6 text-bk-blue" />
        <h1 className={`text-3xl font-extrabold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? 'सूचना / मृत्यु सूचना' : 'Notices'}
        </h1>
      </div>

      {notices.length > 0 ? (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.slug} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{notice.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{notice.description}</p>
              {notice.contact && (
                <p className="mt-2 text-xs text-gray-400">Contact: {notice.contact}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Bell className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className={`text-gray-400 ${isNepali ? 'nepali-text' : ''}`}>
            {isNepali ? 'अहिले कुनै सूचना छैन।' : 'No notices at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
}
