const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function generateTLDR(content: string, lang: 'en' | 'np' = 'en'): Promise<string | null> {
  const prompt = lang === 'np'
    ? `यो समाचार लेखको ३ वटा बुँदामा सारांश लेख्नुहोस्। प्रत्येक बुँदा | ले छुट्याउनुहोस्:\n\n${content}`
    : `Summarize this news article in exactly 3 bullet points. Separate each bullet with |:\n\n${content}`;
  return callGemini(prompt);
}

export async function translateToNepali(englishText: string): Promise<string | null> {
  const prompt = `Translate the following English news article to Nepali. Maintain journalistic tone:\n\n${englishText}`;
  return callGemini(prompt);
}

export async function generateArticle(topic: string): Promise<{
  title_en: string;
  title_np: string;
  summary_en: string[];
  summary_np: string[];
  body_en: string;
  body_np: string;
  category: string;
  tags: string[];
} | null> {
  const today = new Date().toISOString().split('T')[0];
  const prompt = `You are a news editor for Bullet Khabar, Nepal's bilingual news platform.
Today's date: ${today}

Write ONE short news article about: ${topic}

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

  const result = await callGemini(prompt);
  if (!result) return null;

  try {
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
