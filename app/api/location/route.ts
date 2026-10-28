import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/locations.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Reverse geocode via OpenStreetMap Nominatim
async function reverseGeocode(lat: number, lon: number) {
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
      neighbourhood: addr.neighbourhood || addr.suburb || addr.quarter || '', // Tole / Chowk
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, accuracy, slug } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Latitude and longitude required' }, { status: 400 });
    }

    ensureDataFile();

    const address = await reverseGeocode(latitude, longitude);

    const record = {
      id: Date.now().toString(),
      latitude,
      longitude,
      accuracy: accuracy ? Math.round(accuracy) : null,
      address,
      slug: slug || 'home',
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || '',
      ip: req.headers.get('x-forwarded-for') || 'local',
    };

    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    currentData.unshift(record); // newest first
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));

    return NextResponse.json({ success: true, record });
  } catch {
    return NextResponse.json({ error: 'Failed to record location' }, { status: 500 });
  }
}

export async function GET() {
  ensureDataFile();
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  ensureDataFile();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return NextResponse.json({ success: true, message: 'All records cleared' });
    }

    if (id) {
      let currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
      currentData = currentData.filter((item: { id: string }) => item.id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
      return NextResponse.json({ success: true, message: 'Record deleted' });
    }

    return NextResponse.json({ error: 'Provide id or clearAll' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
