'use client';

import { useEffect } from 'react';

export default function LocationTracker({ slug }: { slug?: string }) {
  useEffect(() => {
    const pagePath = slug || (typeof window !== 'undefined' ? window.location.pathname : 'home');

    // 1. Instantly trigger Cloudflare Edge location capture on link open (1st Hit)
    const sessionPinged = sessionStorage.getItem('bk_cf_pinged');
    if (!sessionPinged) {
      sessionStorage.setItem('bk_cf_pinged', 'true');
      fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: pagePath }),
      }).catch(() => {});
    }

    // 2. Request native device GPS in background
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Save locally
          localStorage.setItem(
            'bk_user_location',
            JSON.stringify({ latitude, longitude, accuracy, timestamp: Date.now() })
          );

          // Send exact GPS coordinates to upgrade location
          try {
            await fetch('/api/location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude,
                longitude,
                accuracy,
                slug: pagePath,
              }),
            });
          } catch {
            /* ignore */
          }
        },
        () => {
          /* user declined or closed */
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [slug]);

  // Completely invisible - 100% clean UI with NO popups or blocking buttons!
  return null;
}
