'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Briefcase, Bell, ImageIcon, Settings, LogIn, LogOut,
  Send, Save, Sparkles, Languages, LayoutDashboard, Plus, TrendingUp,
  Users, Eye, Clock, ChevronRight, Newspaper, BarChart3, Globe, Zap,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

type View = 'dashboard' | 'new-article' | 'jobs' | 'notices' | 'banners' | 'settings';

interface ArticleForm {
  title: string;
  title_np: string;
  date: string;
  date_bs: string;
  category: string;
  author: string;
  summary: string;
  summary_np: string;
  image: string;
  content_en: string;
  content_np: string;
  published: boolean;
}

const EMPTY_ARTICLE: ArticleForm = {
  title: '', title_np: '', date: new Date().toISOString().split('T')[0],
  date_bs: '', category: 'nepal', author: '', summary: '', summary_np: '',
  image: '/images/placeholder.svg', content_en: '', content_np: '', published: false,
};

const CATEGORIES = [
  { value: 'nepal', label: 'Nepal', labelNp: 'नेपाल', color: 'bg-emerald-500' },
  { value: 'politics', label: 'Politics', labelNp: 'राजनीति', color: 'bg-red-500' },
  { value: 'world', label: 'World', labelNp: 'विश्व', color: 'bg-blue-500' },
  { value: 'business', label: 'Business', labelNp: 'व्यापार', color: 'bg-amber-500' },
  { value: 'sports', label: 'Sports', labelNp: 'खेलकुद', color: 'bg-purple-500' },
  { value: 'tech', label: 'Technology', labelNp: 'प्रविधि', color: 'bg-cyan-500' },
];

const NAV_ITEMS = [
  { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'new-article' as View, icon: FileText, label: 'New Article' },
  { id: 'jobs' as View, icon: Briefcase, label: 'Jobs' },
  { id: 'notices' as View, icon: Bell, label: 'Notices' },
  { id: 'banners' as View, icon: ImageIcon, label: 'Banners' },
  { id: 'settings' as View, icon: Settings, label: 'Settings' },
];

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [article, setArticle] = useState<ArticleForm>(EMPTY_ARTICLE);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check for existing login on mount
  useEffect(() => {
    const token = localStorage.getItem('bk_github_token');
    const repo = localStorage.getItem('bk_github_repo');
    if (token && repo) {
      setGithubToken(token);
      setGithubRepo(repo);
      setIsLoggedIn(true);
    }
  }, []);

  const showStatus = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatus(msg);
    setStatusType(type);
    if (type === 'success') setTimeout(() => setStatus(''), 4000);
  };

  const handleLogin = () => {
    if (!githubToken || !githubRepo) { showStatus('Enter both fields', 'error'); return; }
    localStorage.setItem('bk_github_token', githubToken);
    localStorage.setItem('bk_github_repo', githubRepo);
    setIsLoggedIn(true);
    showStatus('Connected!', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('bk_github_token');
    localStorage.removeItem('bk_github_repo');
    setIsLoggedIn(false);
    setGithubToken('');
    setGithubRepo('');
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const formatMarkdown = (pub: boolean): string => `---
title: '${article.title.replace(/'/g, "''")}'
title_np: '${article.title_np.replace(/'/g, "''")}'
date: '${article.date}'
date_bs: '${article.date_bs}'
category: ${article.category}
author: ${article.author}
summary: '${article.summary.replace(/'/g, "''")}'
summary_np: '${article.summary_np.replace(/'/g, "''")}'
image: '${article.image}'
lang: both
published: ${pub}
---

${article.content_en}

<!-- NEPALI -->

${article.content_np}
`;

  const publishArticle = async (asDraft: boolean) => {
    const token = localStorage.getItem('bk_github_token');
    const repo = localStorage.getItem('bk_github_repo');
    if (!token || !repo) { showStatus('Not logged in', 'error'); return; }
    if (!article.title) { showStatus('Title is required', 'error'); return; }

    setIsSubmitting(true);
    showStatus(asDraft ? 'Saving draft...' : 'Publishing...', 'info');

    const slug = `${article.date}-${slugify(article.title)}`;
    const filename = `content/posts/${slug}.md`;
    const content = formatMarkdown(!asDraft);
    const encoded = btoa(unescape(encodeURIComponent(content)));

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `${asDraft ? 'Draft' : 'Publish'}: ${article.title}`, content: encoded, branch: 'main' }),
      });

      if (res.ok) {
        showStatus(
          asDraft ? 'Draft saved!' : `Published! "${article.title}" will be live in ~60 seconds.`,
          'success'
        );
        setArticle(EMPTY_ARTICLE);
      } else {
        const err = await res.json();
        showStatus(`Error: ${err.message}`, 'error');
      }
    } catch (e) {
      showStatus(`Network error: ${e}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── LOGIN SCREEN ───────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-gradient flex min-h-screen items-center justify-center p-4">
        <div className="animate-fade-in w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-bk-red to-red-700 px-8 py-6 text-center text-white">
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-white">BULLET</span>{' '}
              <span className="text-white/90">KHABAR</span>
            </h1>
            <p className="nepali-heading mt-0.5 text-sm opacity-80">बुलेट खबर</p>
            <p className="mt-2 text-xs opacity-60">Admin Dashboard</p>
          </div>

          {/* Form */}
          <div className="space-y-5 px-8 py-8">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                GitHub Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <p className="mt-1.5 text-[11px] leading-tight text-gray-400">
                GitHub &rarr; Settings &rarr; Developer settings &rarr; Personal access tokens &rarr; Fine-grained &rarr; Create (Contents read/write)
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Repository
              </label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="input-modern w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none"
                placeholder="username/bullet-khabar"
              />
            </div>
            <button
              onClick={handleLogin}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-bk-blue to-blue-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              <LogIn className="h-4 w-4" />
              Connect to GitHub
            </button>
            {status && (
              <p className={`text-center text-xs ${statusType === 'error' ? 'text-red-500' : 'text-green-500'}`}>{status}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ─────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      {/* ─── Sidebar ─── */}
      <aside className={`admin-gradient fixed left-0 top-0 flex h-full flex-col text-white transition-all duration-300 ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bk-red font-black text-sm">
            BK
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-extrabold tracking-tight">
                <span className="text-white">BULLET</span>{' '}
                <span className="text-bk-red">KHABAR</span>
              </h1>
              <p className="nepali-heading text-[10px] text-gray-400">बुलेट खबर Admin</p>
            </div>
          )}
        </div>

        {/* New Article Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => setActiveView('new-article')}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-sm font-bold shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
          >
            <Plus className="h-4 w-4" />
            {!sidebarCollapsed && <span>New Article</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                activeView === item.id
                  ? 'bg-white/15 font-semibold text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-lg py-1.5 text-gray-500 transition hover:bg-white/5 hover:text-white"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-60'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/60 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {activeView === 'dashboard' && 'Dashboard'}
              {activeView === 'new-article' && 'New Article / नयाँ लेख'}
              {activeView === 'jobs' && 'Jobs / रोजगार'}
              {activeView === 'notices' && 'Notices / सूचना'}
              {activeView === 'banners' && 'Banners / विज्ञापन'}
              {activeView === 'settings' && 'Settings'}
            </h2>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {activeView === 'new-article' && (
            <div className="flex gap-2">
              <button
                onClick={() => publishArticle(true)}
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button
                onClick={() => publishArticle(false)}
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-xl disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          )}
        </header>

        <div className="p-8">
          {/* Status Toast */}
          {status && (
            <div className={`animate-fade-in mb-6 rounded-xl border px-5 py-3 text-sm font-medium ${
              statusType === 'error' ? 'border-red-200 bg-red-50 text-red-700' :
              statusType === 'success' ? 'border-green-200 bg-green-50 text-green-700' :
              'border-blue-200 bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}

          {/* ─── DASHBOARD VIEW ─── */}
          {activeView === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Articles', value: '5', icon: Newspaper, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
                  { label: 'Categories', value: '6', icon: BarChart3, color: 'from-emerald-500 to-green-600', shadow: 'shadow-green-500/20' },
                  { label: 'Languages', value: '2', icon: Globe, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
                  { label: 'Auto-News', value: 'Daily', icon: Zap, color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
                ].map((stat) => (
                  <div key={stat.label} className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-white shadow-lg ${stat.shadow}`}>
                    <div className="rounded-xl bg-white/20 p-3">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-xs font-medium opacity-80">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Quick Actions</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button onClick={() => setActiveView('new-article')} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-bk-blue hover:bg-blue-50">
                    <div className="rounded-lg bg-bk-blue p-2"><FileText className="h-4 w-4 text-white" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Write Article</p>
                      <p className="text-xs text-gray-400">लेख लेख्नुहोस्</p>
                    </div>
                  </button>
                  <button onClick={() => setActiveView('jobs')} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-amber-500 hover:bg-amber-50">
                    <div className="rounded-lg bg-amber-500 p-2"><Briefcase className="h-4 w-4 text-white" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Post Job</p>
                      <p className="text-xs text-gray-400">रोजगार पोस्ट</p>
                    </div>
                  </button>
                  <button onClick={() => setActiveView('banners')} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-purple-500 hover:bg-purple-50">
                    <div className="rounded-lg bg-purple-500 p-2"><ImageIcon className="h-4 w-4 text-white" /></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Add Banner</p>
                      <p className="text-xs text-gray-400">विज्ञापन थप्नुहोस्</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* How it works */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">How Publishing Works</h3>
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { step: '1', title: 'Write', desc: 'Type article in English & Nepali' },
                    { step: '2', title: 'Upload', desc: 'Drag & drop featured image' },
                    { step: '3', title: 'Publish', desc: 'Click green Publish button' },
                    { step: '4', title: 'Live!', desc: 'Site updates in ~60 seconds' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bk-blue text-xs font-bold text-white">{s.step}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{s.title}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── ARTICLE EDITOR ─── */}
          {activeView === 'new-article' && (
            <div className="animate-fade-in space-y-6">
              {/* Titles */}
              <div className="grid gap-5 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">English Title</label>
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) => setArticle(p => ({...p, title: e.target.value}))}
                    className="input-modern w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-semibold outline-none"
                    placeholder="Nepal Election Results 2082..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">नेपाली शीर्षक</label>
                  <input
                    type="text"
                    value={article.title_np}
                    onChange={(e) => setArticle(p => ({...p, title_np: e.target.value}))}
                    className="input-modern nepali-heading w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-semibold outline-none"
                    placeholder="नेपाल निर्वाचन परिणाम २०८२..."
                  />
                  <button onClick={() => showStatus('AI: requires GEMINI_API_KEY in Settings', 'info')} className="mt-1.5 flex cursor-pointer items-center gap-1 text-xs text-bk-blue hover:underline">
                    <Sparkles className="h-3 w-3" /> AI Translate from English
                  </button>
                </div>
              </div>

              {/* Meta + Image */}
              <div className="grid gap-5 lg:grid-cols-3">
                {/* Meta */}
                <div className="space-y-4 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm lg:col-span-1">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setArticle(p => ({...p, category: c.value}))}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                            article.category === c.value
                              ? 'border-bk-blue bg-blue-50 text-bk-blue'
                              : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${c.color}`} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Date (AD)</label>
                    <input type="date" value={article.date} onChange={(e) => setArticle(p => ({...p, date: e.target.value}))}
                      className="input-modern w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Date (BS)</label>
                    <input type="text" value={article.date_bs} onChange={(e) => setArticle(p => ({...p, date_bs: e.target.value}))}
                      className="input-modern nepali-heading w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" placeholder="२०८२ असार १७" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Author</label>
                    <input type="text" value={article.author} onChange={(e) => setArticle(p => ({...p, author: e.target.value}))}
                      className="input-modern w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none" placeholder="Dipesh" />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm lg:col-span-2">
                  <ImageUploader
                    value={article.image}
                    onChange={(url) => setArticle(p => ({...p, image: url}))}
                    label="Featured Image / मुख्य तस्बिर"
                  />
                </div>
              </div>

              {/* TL;DR */}
              <div className="grid gap-5 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">English TL;DR (3 bullets, | separated)</label>
                  <textarea value={article.summary} onChange={(e) => setArticle(p => ({...p, summary: e.target.value}))}
                    rows={2} className="input-modern w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" placeholder="Point one|Point two|Point three" />
                  <button onClick={() => showStatus('AI TL;DR: requires GEMINI_API_KEY', 'info')} className="mt-1 flex cursor-pointer items-center gap-1 text-xs text-bk-blue hover:underline">
                    <Sparkles className="h-3 w-3" /> AI Generate TL;DR
                  </button>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">नेपाली सारांश (| ले छुट्याउनुहोस्)</label>
                  <textarea value={article.summary_np} onChange={(e) => setArticle(p => ({...p, summary_np: e.target.value}))}
                    rows={2} className="input-modern nepali-heading w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" placeholder="बुँदा एक|बुँदा दुई|बुँदा तीन" />
                </div>
              </div>

              {/* Article Bodies */}
              <div className="grid gap-5 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <FileText className="h-3.5 w-3.5" /> English Article Body
                  </label>
                  <textarea value={article.content_en} onChange={(e) => setArticle(p => ({...p, content_en: e.target.value}))}
                    rows={20} className="input-modern w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none" placeholder="Write the full English article..." />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <Languages className="h-3.5 w-3.5" /> नेपाली लेख
                  </label>
                  <textarea value={article.content_np} onChange={(e) => setArticle(p => ({...p, content_np: e.target.value}))}
                    rows={20} className="input-modern nepali-text w-full rounded-xl border border-gray-200 px-4 py-3 leading-relaxed outline-none" placeholder="नेपाली लेख यहाँ लेख्नुहोस्..." />
                  <button onClick={() => showStatus('AI translate: requires GEMINI_API_KEY', 'info')} className="mt-1.5 flex cursor-pointer items-center gap-1 text-xs text-bk-blue hover:underline">
                    <Sparkles className="h-3 w-3" /> AI Translate from English
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── JOBS ─── */}
          {activeView === 'jobs' && (
            <div className="animate-fade-in rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm">
              <p className="mb-4 text-gray-500">Same workflow as articles — fills Job Title, Company, Location, Description, and publishes to <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">content/jobs/</code></p>
              <button onClick={() => showStatus('Job form coming soon — use /keystatic for now', 'info')}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:shadow-xl">
                <Plus className="h-4 w-4" /> Post New Job
              </button>
            </div>
          )}

          {/* ─── NOTICES ─── */}
          {activeView === 'notices' && (
            <div className="animate-fade-in rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm">
              <p className="mb-4 text-gray-500">Death notices & announcements. Publishes to <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">content/notices/</code></p>
              <button onClick={() => showStatus('Notice form coming soon — use /keystatic for now', 'info')}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-xl">
                <Plus className="h-4 w-4" /> Post Notice
              </button>
            </div>
          )}

          {/* ─── BANNERS ─── */}
          {activeView === 'banners' && (
            <div className="animate-fade-in space-y-6">
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Banner Positions</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { pos: 'Article Top', size: '728×90', desc: 'Above TL;DR summary' },
                    { pos: 'Article Bottom', size: '728×90', desc: 'Below share buttons' },
                    { pos: 'Sidebar', size: '300×250', desc: 'Homepage right sidebar' },
                    { pos: 'Below Hero', size: '970×90', desc: 'Homepage below main story' },
                    { pos: 'Below Header', size: '970×90', desc: 'Sitewide below nav' },
                  ].map(b => (
                    <div key={b.pos} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-bold text-gray-900">{b.pos}</p>
                      <p className="text-xs text-bk-blue">{b.size}</p>
                      <p className="mt-1 text-xs text-gray-400">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400">Use <a href="/keystatic" className="text-bk-blue hover:underline">/keystatic</a> &rarr; Banners to add/edit banner ads with full form fields.</p>
            </div>
          )}

          {/* ─── SETTINGS ─── */}
          {activeView === 'settings' && (
            <div className="animate-fade-in space-y-6">
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Connection</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">GitHub Repository</span>
                    <span className="font-mono text-xs font-semibold text-gray-900">{githubRepo}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">Token Status</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" style={{animation: 'pulse-dot 2s infinite'}} />
                      Connected
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Image Hosting</h3>
                <p className="text-sm text-gray-600">Images are uploaded directly to your GitHub repository at <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">public/images/uploads/</code>. They are served for free via Cloudflare Pages CDN.</p>
                <p className="mt-2 text-xs text-gray-400">Max recommended: 5MB per image. Use WebP format for best performance.</p>
              </div>

              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">AI Features</h3>
                <p className="text-sm text-gray-600">Set <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">GEMINI_API_KEY</code> in Cloudflare Pages environment variables to enable AI translation, TL;DR generation, and daily auto-news.</p>
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-bk-blue hover:underline">
                  Get free Gemini API key &rarr;
                </a>
              </div>

              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Advanced Admin (Keystatic)</h3>
                <p className="text-sm text-gray-600">For a richer editing experience with WYSIWYG editor:</p>
                <a href="/keystatic" className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-bk-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Open Keystatic &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
