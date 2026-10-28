'use client';

import { Zap } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const SCHEDULE = [
  { day: 'Sunday', dayNp: 'आइतबार', time: '6:00-9:00 AM' },
  { day: 'Monday', dayNp: 'सोमबार', time: '10:00-1:00 PM' },
  { day: 'Tuesday', dayNp: 'मंगलबार', time: '5:00-8:00 PM' },
  { day: 'Wednesday', dayNp: 'बुधबार', time: '6:00-9:00 AM' },
  { day: 'Thursday', dayNp: 'बिहीबार', time: '2:00-5:00 PM' },
  { day: 'Friday', dayNp: 'शुक्रबार', time: 'No outage' },
  { day: 'Saturday', dayNp: 'शनिबार', time: 'No outage' },
];

export default function LoadSheddingWidget() {
  const { isNepali } = useLanguage();
  const todayIdx = new Date().getDay();

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-500" />
        <h3 className={`text-sm font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? 'लोड सेडिङ तालिका' : 'Load Shedding'}
        </h3>
      </div>
      <table className="w-full text-xs">
        <tbody>
          {SCHEDULE.map((s, i) => (
            <tr
              key={s.day}
              className={`border-t border-gray-50 ${i === todayIdx ? 'bg-yellow-50 font-semibold' : ''}`}
            >
              <td className={`py-1.5 ${isNepali ? 'nepali-heading' : ''}`}>
                {isNepali ? s.dayNp : s.day}
                {i === todayIdx && (
                  <span className="ml-1 text-[10px] text-yellow-600">
                    {isNepali ? '(आज)' : '(today)'}
                  </span>
                )}
              </td>
              <td className="py-1.5 text-right text-gray-600">{s.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
