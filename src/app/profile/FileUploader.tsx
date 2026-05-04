"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, FileText, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUrl(data.url);
        onUploadComplete(data.url);
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
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a6040] ml-1">{label}</label>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4
          ${uploading ? "border-[#cb4b16]/50 bg-[#cb4b16]/5" : "border-[#cfc3a0] bg-[#eee8d5]/20 hover:border-[#cb4b16] hover:bg-[#fdf6e3]"}
          ${currentUrl ? "border-[#2aa198]/30 bg-[#2aa198]/5" : ""}
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
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#cfc3a0] flex items-center justify-center text-[#cb4b16] shadow-sm group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#2d2013]">Click to upload or drag and drop</p>
              <p className="text-[10px] text-[#7a6040] uppercase tracking-widest font-black mt-1">PDF / DOCX (MAX. 5MB)</p>
            </div>
          </>
        )}

        {uploading && (
          <div className="w-full max-w-[240px] flex flex-col items-center gap-4 py-2">
            <div className="w-full h-2 bg-[#eee8d5] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#cb4b16]" 
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-[#cb4b16] uppercase tracking-widest animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Compressing &amp; Indexing... {progress}%
            </div>
          </div>
        )}

        {!uploading && currentUrl && (
          <div className="flex items-center gap-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-[#cfc3a0]">
            <div className="w-10 h-10 rounded-lg bg-[#2aa198]/10 flex items-center justify-center text-[#2aa198]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[#2d2013] truncate">Resume_Verified.pdf</p>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(currentUrl, '_blank');
                }}
                className="text-[10px] font-black text-[#cb4b16] uppercase tracking-widest hover:underline mt-0.5"
              >
                Inspect Original
              </button>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentUrl("");
                onUploadComplete("");
              }}
              className="p-2 hover:bg-[#cb4b16]/10 rounded-lg text-[#b5a080] hover:text-[#cb4b16] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
