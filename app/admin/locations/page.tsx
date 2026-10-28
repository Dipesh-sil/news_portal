'use client';

import { useState, useEffect } from 'react';
import { MapPin, Trash2, ExternalLink, RefreshCw, Smartphone, Globe, Shield } from 'lucide-react';

interface Address {
  displayName: string;
  road: string;
  neighbourhood: string;
  city: string;
  district: string;
  state: string;
  country: string;
  mapsUrl: string;
}

interface LocationRecord {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: Address;
  slug: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

export default function LocationsAdmin() {
  const [records, setRecords] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/location');
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const deleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location log?')) return;
    try {
      const res = await fetch(`/api/location?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const clearAll = async () => {
    if (!confirm('Warning: This will delete ALL captured reader location logs. Continue?')) return;
    try {
      const res = await fetch('/api/location?clearAll=true', { method: 'DELETE' });
      if (res.ok) {
        setRecords([]);
      }
    } catch {
      alert('Failed to clear records');
    }
  };

  const filtered = records.filter((r) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    const addr = r.address?.displayName?.toLowerCase() || '';
    const city = r.address?.city?.toLowerCase() || '';
    const district = r.address?.district?.toLowerCase() || '';
    const slug = r.slug?.toLowerCase() || '';
    return addr.includes(q) || city.includes(q) || district.includes(q) || slug.includes(q);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-bk-red" />
            <h1 className="text-2xl font-black text-gray-900">Reader GPS Location Portal</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Real-time GPS coordinates, reverse-geocoded to exact street, tole, municipality & district.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRecords}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {records.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Logs
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Total Captured Readers</div>
          <div className="mt-1 text-3xl font-extrabold text-gray-900">{records.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">GPS Precision</div>
          <div className="mt-1 text-3xl font-extrabold text-green-600">High Accuracy GPS</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase">Ad Targeting Ready</div>
          <div className="mt-1 flex items-center gap-2 text-lg font-bold text-bk-blue">
            <Shield className="h-5 w-5 text-green-500" /> Ward & District Level
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by city, district, tole, or article read..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-bk-blue focus:outline-none focus:ring-1 focus:ring-bk-blue"
        />
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
          Loading reader locations...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No Location Logs Found</h3>
          <p className="mt-1 text-xs text-gray-500">
            Locations will automatically appear here when visitors open articles and allow location.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Exact Area / Tole</th>
                  <th className="px-4 py-3">City & District</th>
                  <th className="px-4 py-3">GPS Coordinates</th>
                  <th className="px-4 py-3">Article Read</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Timestamp */}
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Tole / Road */}
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <div>
                        {r.address?.neighbourhood || r.address?.road || 'Local Area'}
                      </div>
                      <div className="text-xs font-normal text-gray-500 line-clamp-1 max-w-xs">
                        {r.address?.displayName}
                      </div>
                    </td>

                    {/* City / District */}
                    <td className="px-4 py-3 text-xs">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-bk-blue">
                        {r.address?.city || r.address?.district || 'Nepal'}
                      </span>
                      {r.address?.state && (
                        <div className="mt-0.5 text-gray-400">{r.address.state}</div>
                      )}
                    </td>

                    {/* Coordinates & Accuracy */}
                    <td className="px-4 py-3 text-xs font-mono whitespace-nowrap">
                      <div>
                        {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Accuracy: ±{r.accuracy ?? '?'}m
                      </div>
                    </td>

                    {/* Article / Page */}
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                      {r.slug}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={r.address?.mapsUrl || `https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                          title="Open in Google Maps"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Maps
                        </a>
                        <button
                          onClick={() => deleteRecord(r.id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
