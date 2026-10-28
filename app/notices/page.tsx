import { Metadata } from 'next';
import { getAllNotices } from '@/lib/posts';
import NoticesClient from './NoticesClient';

export const metadata: Metadata = {
  title: 'Notices | सूचना',
  description: 'Death notices and public announcements - मृत्यु सूचना तथा सार्वजनिक सूचना।',
};

export default function NoticesPage() {
  const notices = getAllNotices();
  return <NoticesClient notices={notices} />;
}
