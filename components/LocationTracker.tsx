'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function LocationTracker({ slug }: { slug?: string }) {
  const [denied, setDenied] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [requesting, setRequesting] = useState(false);
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
          slug: slug || window.location.pathname,
        }),
      });
    } catch {
      /* ignore */
    }
  };

  const requestGPS = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;

    setRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setHasLocation(true);
        setDenied(false);
        setRequesting(false);
        sendLocation(latitude, longitude, accuracy);
      },
      (error) => {
        setRequesting(false);
        // Error code 1 = PERMISSION_DENIED
        if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
          setDenied(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Check if location is already captured recently
    const cached = localStorage.getItem('bk_user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.latitude && parsed.longitude) {
          setHasLocation(true);
          return;
        }
      } catch {
        /* invalid json */
      }
    }

    // Auto prompt on first visit
    requestGPS();
  }, []);

  // If already allowed, hide prompt
  if (hasLocation) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl border-2 border-red-500 bg-white p-5 shadow-2xl ring-4 ring-red-100">
        <div className="flex items-start gap-3.5">
          <div className="rounded-full bg-red-100 p-2.5 text-red-600 shrink-0">
            <MapPin className="h-6 w-6 animate-bounce" />
          </div>

          <div className="flex-1">
            <h3 className={`text-base font-bold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
              {isNepali
                ? 'स्थानीय ताजा समाचारका लागि लोकेसन अनुमति दिनुहोस्'
                : 'Allow Location to View Local News & Urgent Reports'}
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {isNepali
                ? 'तपाईंको क्षेत्रको जरूरी सूचना, खोजतलास तथा ताजा समाचार हेर्न कृपया आफ्नो लोकेसन (GPS) सुचारू गर्नुहोस्।'
                : 'Please enable GPS location to access verified local reports, missing person notices, and community updates in your area.'}
            </p>

            {denied && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span>{isNepali ? 'ब्राउजरमा लोकेसन बन्द गरिएको छ' : 'Location is blocked in your browser'}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  {isNepali ? (
                    <>
                      १. माथिल्लो URL बारमा रहेको 🔒 वा ⚙️ मा थिच्नुहोस्।
                      <br />
                      २. <b>Permissions → Location</b> लाई <b>Allow</b> गर्नुहोस्।
                      <br />
                      ३. त्यसपछि तलको बटन थिच्नुहोस्।
                    </>
                  ) : (
                    <>
                      1. Tap the 🔒 lock icon in your address bar.
                      <br />
                      2. Change <b>Location</b> to <b>Allow</b>.
                      <br />
                      3. Then tap the button below.
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={requestGPS}
                disabled={requesting}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-bk-red px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95 disabled:opacity-60"
              >
                {requesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isNepali ? 'जाँच गर्दै...' : 'Checking...'}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{isNepali ? 'लोकेसन अनुमति दिनुहोस्' : 'Allow Location'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
                <span>{isNepali ? 'पुन: लोड गर्नुहोस्' : 'Reload'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
