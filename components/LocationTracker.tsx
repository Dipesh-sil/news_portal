'use client';

import { useEffect } from 'react';

export default function LocationTracker({ slug }: { slug?: string }) {
  useEffect(() => {
    // Only request once per user session
    const hasPrompted = sessionStorage.getItem('bk_geo_prompted');
    if (hasPrompted) return;

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      sessionStorage.setItem('bk_geo_prompted', 'true');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Save locally for quick ad-matching
          localStorage.setItem(
            'bk_user_location',
            JSON.stringify({ latitude, longitude, accuracy, timestamp: Date.now() })
          );

          // Store on backend
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
            /* ignore network errors */
          }
        },
        () => {
          /* user denied or error */
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [slug]);

  return null;
}
