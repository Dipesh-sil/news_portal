import { getAllPosts, getFeaturedPost } from '@/lib/posts';
import HomeClient from './HomeClient';

export default function HomePage() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  return <HomeClient posts={allPosts} featured={featured} />;
}
