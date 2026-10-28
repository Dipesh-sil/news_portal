import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const jobsDirectory = path.join(process.cwd(), 'content/jobs');
const noticesDirectory = path.join(process.cwd(), 'content/notices');
const bannersDirectory = path.join(process.cwd(), 'content/banners');

export interface Post {
  slug: string;
  title: string;
  title_np: string;
  date: string;
  date_bs: string;
  category: string;
  author: string;
  summary: string;
  summary_np: string;
  image: string;
  lang: string;
  published: boolean;
  content: string;
  content_np: string;
  readTime: number;
}

export interface Job {
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
  contact: string;
  expires: string;
  published: boolean;
}

export interface Notice {
  slug: string;
  title: string;
  description: string;
  date: string;
  contact: string;
  published: boolean;
}

function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function splitBilingualContent(rawContent: string): { en: string; np: string } {
  const marker = '<!-- NEPALI -->';
  const idx = rawContent.indexOf(marker);
  if (idx === -1) {
    return { en: rawContent.trim(), np: '' };
  }
  return {
    en: rawContent.substring(0, idx).trim(),
    np: rawContent.substring(idx + marker.length).trim(),
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content: rawContent } = matter(fileContents);
  const { en, np } = splitBilingualContent(rawContent);

  return {
    slug,
    title: data.title || '',
    title_np: data.title_np || '',
    date: data.date || '',
    date_bs: data.date_bs || '',
    category: data.category || 'nepal',
    author: data.author || 'Bullet Khabar',
    summary: data.summary || '',
    summary_np: data.summary_np || '',
    image: data.image || '/images/placeholder.svg',
    lang: data.lang || 'both',
    published: data.published !== false,
    content: en,
    content_np: np,
    readTime: calculateReadTime(en + ' ' + np),
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(slug: string, category: string, count = 3): Post[] {
  return getAllPosts()
    .filter((post) => post.slug !== slug && post.category === category)
    .slice(0, count);
}

export function getFeaturedPost(): Post | null {
  const posts = getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}

export function getCategories(): string[] {
  return ['nepal', 'politics', 'world', 'business', 'sports', 'tech'];
}

function readCollection<T>(directory: string, parser: (slug: string, data: Record<string, unknown>) => T): T[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const filePath = path.join(directory, f);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = f.replace(/\.md$/, '');
      return parser(slug, data as Record<string, unknown>);
    });
}

export function getAllJobs(): Job[] {
  return readCollection<Job>(jobsDirectory, (slug, data) => ({
    slug,
    title: (data.title as string) || '',
    company: (data.company as string) || '',
    location: (data.location as string) || '',
    description: (data.description as string) || '',
    contact: (data.contact as string) || '',
    expires: (data.expires as string) || '',
    published: data.published !== false,
  })).filter((j) => j.published);
}

export function getAllNotices(): Notice[] {
  return readCollection<Notice>(noticesDirectory, (slug, data) => ({
    slug,
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    date: (data.date as string) || '',
    contact: (data.contact as string) || '',
    published: data.published !== false,
  })).filter((n) => n.published);
}

export interface Banner {
  slug: string;
  name: string;
  position: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  altText_np: string;
  advertiser: string;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  published: boolean;
}

export function getAllBanners(): Banner[] {
  return readCollection<Banner>(bannersDirectory, (slug, data) => ({
    slug,
    name: (data.name as string) || '',
    position: (data.position as string) || 'sidebar',
    imageUrl: (data.imageUrl as string) || '',
    linkUrl: (data.linkUrl as string) || '#',
    altText: (data.altText as string) || 'Advertisement',
    altText_np: (data.altText_np as string) || 'विज्ञापन',
    advertiser: (data.advertiser as string) || '',
    startDate: (data.startDate as string) || '',
    endDate: (data.endDate as string) || '',
    isPaid: data.isPaid === true,
    published: data.published !== false,
  })).filter((b) => {
    if (!b.published) return false;
    const now = new Date();
    if (b.startDate && new Date(b.startDate) > now) return false;
    if (b.endDate && new Date(b.endDate) < now) return false;
    return true;
  });
}

export function getBannersByPosition(position: string): Banner[] {
  return getAllBanners().filter((b) => b.position === position);
}
