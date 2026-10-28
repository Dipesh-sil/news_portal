// Cloudflare Pages Function: /api/location

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=ne,en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BulletKhabar-LocationService/1.0',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};

    return {
      displayName: data.display_name || '',
      road: addr.road || addr.street || '',
      neighbourhood: addr.neighbourhood || addr.suburb || addr.quarter || '',
      city: addr.city || addr.town || addr.municipality || addr.village || '',
      district: addr.state_district || addr.county || '',
      state: addr.state || '',
      country: addr.country || '',
      mapsUrl: `https://www.google.com/maps?q=${lat},${lon}`,
    };
  } catch {
    return {
      displayName: '',
      mapsUrl: `https://www.google.com/maps?q=${lat},${lon}`,
    };
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { latitude, longitude, accuracy, slug } = body;

    if (latitude === undefined || longitude === undefined) {
      return new Response(JSON.stringify({ error: 'Latitude and longitude required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const address = await reverseGeocode(latitude, longitude);

    const record = {
      id: Date.now().toString(),
      latitude,
      longitude,
      accuracy: accuracy ? Math.round(accuracy) : null,
      address,
      slug: slug || 'home',
      timestamp: new Date().toISOString(),
      ip: context.request.headers.get('cf-connecting-ip') || 'local',
      userAgent: context.request.headers.get('user-agent') || '',
    };

    return new Response(JSON.stringify({ success: true, record }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to record location' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
