import { config, fields, collection } from '@keystatic/core';

const hasGitHubConfig = !!(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET
);

export default config({
  // LOCAL mode for development or when GitHub env vars aren't configured
  // GITHUB mode for production (Cloudflare Pages) when env vars are set
  storage: hasGitHubConfig
    ? {
        kind: 'github',
        repo: (process.env.NEXT_PUBLIC_GITHUB_REPO as `${string}/${string}`) || 'YOUR_USERNAME/bullet-khabar',
      }
    : { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Articles / लेखहरू',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'English Title / अंग्रेजी शीर्षक' } }),
        title_np: fields.text({ label: 'Nepali Title / नेपाली शीर्षक' }),
        date: fields.date({ label: 'Publish Date / प्रकाशन मिति' }),
        date_bs: fields.text({ label: 'Nepali Date (BS) — e.g. २०८२ असार १७' }),
        category: fields.select({
          label: 'Category / वर्ग',
          options: [
            { label: 'Nepal / नेपाल', value: 'nepal' },
            { label: 'Politics / राजनीति', value: 'politics' },
            { label: 'World / विश्व', value: 'world' },
            { label: 'Business / व्यापार', value: 'business' },
            { label: 'Sports / खेलकुद', value: 'sports' },
            { label: 'Technology / प्रविधि', value: 'tech' },
          ],
          defaultValue: 'nepal',
        }),
        author: fields.text({ label: 'Author / लेखक', defaultValue: 'dipesh' }),
        summary: fields.text({
          label: 'English TL;DR (3 bullets, | separated)',
          description: 'Example: Bullet one|Bullet two|Bullet three',
          multiline: false,
        }),
        summary_np: fields.text({
          label: 'Nepali TL;DR / नेपाली सारांश (3 बुँदा, | ले छुट्याउनुहोस्)',
          description: 'उदाहरण: बुँदा एक|बुँदा दुई|बुँदा तीन',
          multiline: false,
        }),
        image: fields.text({
          label: 'Featured Image Path / मुख्य तस्बिर',
          defaultValue: '/images/placeholder.svg',
          description: 'Upload image to /public/images/ first, then type path like /images/my-photo.jpg',
        }),
        lang: fields.select({
          label: 'Language / भाषा',
          options: [
            { label: 'Both / दुवै', value: 'both' },
            { label: 'English Only', value: 'en' },
            { label: 'Nepali Only / नेपाली मात्र', value: 'np' },
          ],
          defaultValue: 'both',
        }),
        published: fields.checkbox({ label: 'Published? / प्रकाशित?', defaultValue: false }),
        content: fields.mdx({
          label: 'Article Body / लेखको मुख्य भाग',
          description: 'Write English article first, then add <!-- NEPALI --> on a new line, then write Nepali version below it.',
        }),
      },
    }),
    jobs: collection({
      label: 'Jobs / रोजगार',
      slugField: 'title',
      path: 'content/jobs/*',
      schema: {
        title: fields.slug({ name: { label: 'Job Title / पद' } }),
        company: fields.text({ label: 'Company Name / कम्पनी' }),
        location: fields.text({ label: 'Location / स्थान' }),
        description: fields.text({ label: 'Description / विवरण', multiline: true }),
        contact: fields.text({ label: 'Contact Info / सम्पर्क' }),
        expires: fields.date({ label: 'Expiry Date / म्याद' }),
        published: fields.checkbox({ label: 'Published? / प्रकाशित?', defaultValue: true }),
      },
    }),
    notices: collection({
      label: 'Notices / सूचना',
      slugField: 'title',
      path: 'content/notices/*',
      schema: {
        title: fields.slug({ name: { label: 'Notice Title / सूचना शीर्षक' } }),
        description: fields.text({ label: 'Description / विवरण', multiline: true }),
        date: fields.date({ label: 'Date / मिति' }),
        contact: fields.text({ label: 'Contact Info / सम्पर्क' }),
        published: fields.checkbox({ label: 'Published? / प्रकाशित?', defaultValue: true }),
      },
    }),
    banners: collection({
      label: 'Banners / विज्ञापन',
      slugField: 'name',
      path: 'content/banners/*',
      schema: {
        name: fields.slug({ name: { label: 'Banner Name / विज्ञापन नाम' } }),
        position: fields.select({
          label: 'Position / स्थान',
          description: 'Where this banner appears on the site',
          options: [
            { label: 'Article Page — Top (728x90)', value: 'article-top' },
            { label: 'Article Page — Bottom (728x90)', value: 'article-bottom' },
            { label: 'Sidebar (300x250)', value: 'sidebar' },
            { label: 'Homepage — Below Hero (970x90)', value: 'homepage-mid' },
            { label: 'Below Header (970x90)', value: 'header-below' },
          ],
          defaultValue: 'sidebar',
        }),
        imageUrl: fields.text({
          label: 'Banner Image Path / तस्बिर',
          description: 'Example: /images/banners/my-ad.jpg',
        }),
        linkUrl: fields.url({ label: 'Click URL / लिंक' }),
        altText: fields.text({ label: 'Alt Text (English)' }),
        altText_np: fields.text({ label: 'Alt Text (Nepali)' }),
        advertiser: fields.text({ label: 'Advertiser / विज्ञापनदाता' }),
        startDate: fields.date({ label: 'Start Date / सुरु मिति' }),
        endDate: fields.date({ label: 'End Date / अन्त्य मिति' }),
        isPaid: fields.checkbox({ label: 'Paid Ad? / भुक्तानी विज्ञापन?', defaultValue: false }),
        published: fields.checkbox({ label: 'Active? / सक्रिय?', defaultValue: true }),
      },
    }),
  },
});
