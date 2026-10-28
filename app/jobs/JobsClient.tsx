'use client';

import { useLanguage } from '@/lib/language';
import { Briefcase, MapPin, Mail } from 'lucide-react';
import type { Job } from '@/lib/posts';

interface Props {
  jobs: Job[];
}

export default function JobsClient({ jobs }: Props) {
  const { isNepali } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Briefcase className="h-6 w-6 text-bk-blue" />
        <h1 className={`text-3xl font-extrabold text-gray-900 ${isNepali ? 'nepali-heading' : ''}`}>
          {isNepali ? 'रोजगार' : 'Job Listings'}
        </h1>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.slug} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {job.contact}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className={`text-gray-400 ${isNepali ? 'nepali-text' : ''}`}>
            {isNepali ? 'अहिले कुनै रोजगारी सूचीकरण छैन।' : 'No job listings at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
}
