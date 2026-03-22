"use client";

import { useState, useRef } from "react";

interface FileUploaderProps {
  label: string;
  accept: string;
  onUploadComplete: (url: string) => void;
  initialUrl?: string;
}

export default function FileUploader({ label, accept, onUploadComplete, initialUrl }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(initialUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // In a real app, you'd use something like UploadThing or Vercel Blob
      // For now, we'll simulate a successful upload and return a mock URL
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const url = data.url;
        setCurrentUrl(url);
        onUploadComplete(url);
        setProgress(100);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3
          ${uploading ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 hover:border-blue-500/30 hover:bg-white/5"}
          ${currentUrl ? "border-green-500/30 bg-green-500/5" : ""}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {!uploading && !currentUrl && (
          <>
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p className="text-sm font-medium text-slate-300">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500 uppercase tracking-tighter">PDF or DOCX (MAX. 5MB)</p>
          </>
        )}

        {uploading && (
          <div className="w-full max-w-[200px] flex flex-col items-center gap-3">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-blue-400 animate-pulse uppercase tracking-widest">Uploading... {progress}%</p>
          </div>
        )}

        {!uploading && currentUrl && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">File Uploaded!</p>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(currentUrl, '_blank');
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                View Current Resume
              </button>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentUrl("");
                onUploadComplete("");
              }}
              className="ml-4 p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
