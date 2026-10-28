import { Metadata } from 'next';
import { getAllJobs } from '@/lib/posts';
import JobsClient from './JobsClient';

export const metadata: Metadata = {
  title: 'Jobs | रोजगार',
  description: 'Job listings and career opportunities in Nepal.',
};

export default function JobsPage() {
  const jobs = getAllJobs();
  return <JobsClient jobs={jobs} />;
}
