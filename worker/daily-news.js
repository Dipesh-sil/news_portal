// Cloudflare Worker — Daily Auto-News Generator for Bullet Khabar
// Schedule: '15 0 * * *' (6:00 AM Nepal Time = UTC 00:15)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default {
  async scheduled(event, env) {
    try {
      const article = await generateArticle(env.GEMINI_API_KEY);
      if (!article) {
        console.error('Failed to generate article');
        return;
      }

      const markdown = formatAsMarkdown(article);
      const filename = `${article.date}-auto-generated.md`;

      await commitToGitHub(env.GITHUB_TOKEN, env.GITHUB_REPO, filename, markdown);
      console.log(`Successfully published: ${filename}`);
    } catch (error) {
      console.error('Daily news generation failed:', error);
    }
  },
};

async function generateArticle(apiKey) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const prompt = `You are a news editor for Bullet Khabar, Nepal's bilingual news platform.
Today's date: ${dateStr}

Write ONE short news article about the most important story happening in Nepal or affecting Nepali people globally today.

Return ONLY valid JSON with this structure:
{
  "title_en": "English headline",
  "title_np": "नेपाली शीर्षक",
  "summary_en": ["bullet 1", "bullet 2", "bullet 3"],
  "summary_np": ["बुँदा १", "बुँदा २", "बुँदा ३"],
  "body_en": "Full English article 200-300 words",
  "body_np": "पूर्ण नेपाली लेख २००-३०० शब्द",
  "category": "politics|world|nepal|business|sports|tech",
  "tags": ["tag1", "tag2", "tag3"]
}
Do not include any markdown or explanation outside the JSON.`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    parsed.date = dateStr;
    return parsed;
  } catch {
    return null;
  }
}

function formatAsMarkdown(article) {
  const summaryEn = article.summary_en.join('|');
  const summaryNp = article.summary_np.join('|');

  return `---
title: '${article.title_en.replace(/'/g, "''")}'
title_np: '${article.title_np.replace(/'/g, "''")}'
date: '${article.date}'
date_bs: ''
category: ${article.category}
author: AI Reporter
summary: '${summaryEn.replace(/'/g, "''")}'
summary_np: '${summaryNp.replace(/'/g, "''")}'
image: '/images/placeholder.svg'
lang: both
published: true
---

${article.body_en}

<!-- NEPALI -->

${article.body_np}
`;
}

async function commitToGitHub(token, repo, filename, content) {
  const path = `content/posts/${filename}`;
  const encoded = btoa(unescape(encodeURIComponent(content)));

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'BulletKhabar-Worker',
    },
    body: JSON.stringify({
      message: `Auto-generated daily news: ${filename}`,
      content: encoded,
      branch: 'main',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub commit failed: ${error}`);
  }
}
