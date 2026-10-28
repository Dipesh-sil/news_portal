import { getPostsByCategory, getCategories } from '@/lib/posts';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

const CATEGORY_META: Record<string, { en: string; np: string }> = {
  nepal: { en: 'Nepal', np: 'नेपाल' },
  politics: { en: 'Politics', np: 'राजनीति' },
  world: { en: 'World', np: 'विश्व' },
  business: { en: 'Business', np: 'व्यापार' },
  sports: { en: 'Sports', np: 'खेलकुद' },
  tech: { en: 'Technology', np: 'प्रविधि' },
};

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { en: category, np: category };
  return {
    title: `${meta.en} News | ${meta.np}`,
    description: `Latest ${meta.en} news from Bullet Khabar. ${meta.np} समाचार।`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const meta = CATEGORY_META[category] || { en: category, np: category };

  return <CategoryClient posts={posts} categoryEn={meta.en} categoryNp={meta.np} />;
}
