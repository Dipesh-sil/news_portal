'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Featured Image' }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToGitHub = useCallback(async (file: File) => {
    const token = localStorage.getItem('bk_github_token');
    const repo = localStorage.getItem('bk_github_repo');
    if (!token || !repo) {
      setUploadStatus('Login required to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Strip data:... prefix
        };
        reader.readAsDataURL(file);
      });

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
      const filepath = `public/images/uploads/${timestamp}-${safeName}`;

      // Upload to GitHub
      const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filepath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload image: ${safeName}`,
          content: base64,
          branch: 'main',
        }),
      });

      if (res.ok) {
        const imagePath = `/images/uploads/${timestamp}-${safeName}`;
        onChange(imagePath);
        setPreview(URL.createObjectURL(file));
        setUploadStatus('Uploaded!');
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        const err = await res.json();
        setUploadStatus(`Error: ${err.message}`);
      }
    } catch (e) {
      setUploadStatus(`Upload failed: ${e}`);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadToGitHub(file);
    }
  }, [uploadToGitHub]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToGitHub(file);
  };

  return (
    <div className="animate-fade-in">
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>

      {/* Preview */}
      {(preview || value) && (
        <div className="relative mb-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img
            src={preview || value}
            alt="Preview"
            className="h-44 w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            onClick={() => { onChange(''); setPreview(''); }}
            className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`drop-zone flex cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition ${isDragging ? 'dragging' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {isUploading ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-bk-blue" />
            <p className="text-sm font-medium text-bk-blue">Uploading to GitHub...</p>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-xl bg-blue-50 p-3">
              <Upload className="h-6 w-6 text-bk-blue" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Drag & drop image here, or <span className="text-bk-blue">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
          </>
        )}
      </div>

      {/* Status */}
      {uploadStatus && (
        <div className={`mt-2 flex items-center gap-1.5 text-xs ${uploadStatus.includes('Error') || uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
          {uploadStatus === 'Uploaded!' ? <Check className="h-3.5 w-3.5" /> : null}
          {uploadStatus}
        </div>
      )}

      {/* Manual path input */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-modern w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 outline-none"
          placeholder="Or type path: /images/my-photo.jpg"
        />
      </div>
    </div>
  );
}
