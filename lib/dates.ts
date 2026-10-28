const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliNumerals(str: string): string {
  return str.replace(/[0-9]/g, (d) => NEPALI_DIGITS[parseInt(d)]);
}

export function formatADDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatBSDate(bsDate: string): string {
  if (!bsDate) return '';
  return bsDate;
}

export function getRelativeTime(dateString: string, lang: 'en' | 'np' = 'en'): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (lang === 'np') {
    if (diffMins < 1) return 'अहिले भर्खर';
    if (diffMins < 60) return `${toNepaliNumerals(String(diffMins))} मिनेट अगाडि`;
    if (diffHours < 24) return `${toNepaliNumerals(String(diffHours))} घण्टा अगाडि`;
    if (diffDays < 7) return `${toNepaliNumerals(String(diffDays))} दिन अगाडि`;
    return formatBSDate('');
  }

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatADDate(dateString);
}

export function getCurrentBSDate(): string {
  return '२०८२';
}
