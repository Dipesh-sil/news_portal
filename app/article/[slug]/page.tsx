import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleClient from './ArticleClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) return { title: 'Article Not Found', robots: { index: false, follow: false } };

  return {
    title: post.title,
    description: post.summary.split('|')[0],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary.split('|')[0],
      images: [{ url: post.image }],
      publishedTime: post.date,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary.split('|')[0],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = getRelatedPosts(slug, post.category, 3);

  return <ArticleClient post={post} related={related} />;
}
