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

  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://bulletkhabar.pages.dev';
  const fullImageUrl = post.image.startsWith('http') ? post.image : `${siteBase}${post.image}`;
  const displayTitle = post.title_np || post.title;
  const displayDesc = (post.summary_np || post.summary).split('|')[0];

  return {
    title: displayTitle,
    description: displayDesc,
    openGraph: {
      type: 'article',
      url: `${siteBase}/article/${slug}/`,
      title: displayTitle,
      description: displayDesc,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 675,
          alt: displayTitle,
        },
      ],
      publishedTime: post.date,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: displayDesc,
      images: [fullImageUrl],
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
