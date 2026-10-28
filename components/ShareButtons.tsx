'use client';

import { useState, useEffect } from 'react';
import { Share2, Send, MessageCircle, Link as LinkIcon, Check, Share } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface Props {
  url?: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || '');
  const [canNativeShare, setCanNativeShare] = useState(false);
  const { isNepali } = useLanguage();

  useEffect(() => {
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    setShareUrl(finalUrl);
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, [url]);

  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url: shareUrl,
        });
      } catch {
        /* user cancelled or failed */
      }
    }
  };

  const copyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-500">
        {isNepali ? 'सेयर गर्नुहोस्:' : 'Share:'}
      </span>

      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-bk-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
          aria-label="Share"
        >
          <Share className="h-3.5 w-3.5" />
          <span>{isNepali ? 'सबैतिर सेयर' : 'Share Now'}</span>
        </button>
      )}

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        aria-label="Share on Facebook"
      >
        <Share2 className="h-3.5 w-3.5" />
        Facebook
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
      </a>

      {/* Viber */}
      <a
        href={`viber://forward?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#7360F2] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        aria-label="Share on Viber"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Viber
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black"
        aria-label="Share on X"
      >
        <Send className="h-3.5 w-3.5" />
        X
      </a>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="font-semibold text-green-600">{isNepali ? 'लिङ्क प्रतिलिपि भयो!' : 'Copied!'}</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5 text-gray-500" />
            <span>{isNepali ? 'लिङ्क कपी' : 'Copy Link'}</span>
          </>
        )}
      </button>
    </div>
  );
}
