'use client';

import { useState, useEffect } from 'react';
import { Globe, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function LocationTracker({ slug }: { slug?: string }) {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isNepali } = useLanguage();

  const sendLocation = async (latitude: number, longitude: number, accuracy: number | null) => {
    localStorage.setItem(
      'bk_user_location',
      JSON.stringify({ latitude, longitude, accuracy, timestamp: Date.now() })
    );

    try {
      await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy,
          slug: slug || (typeof window !== 'undefined' ? window.location.pathname : 'home'),
        }),
      });
    } catch {
      /* ignore */
    }
  };

  const sendZeroClickIPPing = async () => {
    const sessionPinged = sessionStorage.getItem('bk_ip_pinged');
    if (sessionPinged) return;
    sessionStorage.setItem('bk_ip_pinged', 'true');

    try {
      await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ip_only',
          slug: slug || (typeof window !== 'undefined' ? window.location.pathname : 'home'),
        }),
      });
    } catch {
      /* ignore */
    }
  };

  const handleConfirmAndRead = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setHasConfirmed(true);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setHasConfirmed(true);
        setLoading(false);
        sendLocation(latitude, longitude, accuracy);
      },
      () => {
        // If user dismisses, close smoothly without alarming them
        setHasConfirmed(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // 1. Immediately send zero-click IP ping
    sendZeroClickIPPing();

    // 2. Check if already confirmed in localStorage
    const cached = localStorage.getItem('bk_user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.latitude && parsed.longitude) {
          setHasConfirmed(true);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  // When confirmed or already stored, don't show anything
  if (hasConfirmed) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-md p-4 shadow-xl ring-1 ring-black/5 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-bk-blue">
            <Globe className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-bk-blue">
              <Sparkles className="h-3 w-3" />
              <span>{isNepali ? 'ग्लोबल पाठक पहुँच' : 'Global Reader Access'}</span>
            </div>

            <p className="mt-0.5 text-xs font-medium text-gray-700 leading-snug">
              {isNepali
                ? 'आफ्नो क्षेत्रीय नेटवर्क पुष्टि गरी सम्पूर्ण समाचार पढ्नुहोस्।'
                : 'Read this post by confirming your global reader presence.'}
            </p>
          </div>

          <button
            onClick={handleConfirmAndRead}
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-1.5 shrink-0 rounded-xl bg-bk-blue px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="text-[11px]">{isNepali ? 'प्रतीक्षा...' : 'Loading...'}</span>
            ) : (
              <>
                <span>{isNepali ? 'जारी राख्नुहोस्' : 'Continue'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
