"use client";

import { useState } from "react";

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  year: string;
  proofUrl?: string;
}

interface CertificateManagerProps {
  initialCertificates: Certificate[];
  onChange: (certs: Certificate[]) => void;
}

export default function CertificateManager({ initialCertificates, onChange }: CertificateManagerProps) {
  const [certs, setCerts] = useState<Certificate[]>(initialCertificates);
  const [newCert, setNewCert] = useState<Omit<Certificate, 'id'>>({ title: "", issuer: "", year: "", proofUrl: "" });
  const [uploading, setUploading] = useState(false);

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setNewCert(prev => ({ ...prev, proofUrl: data.url }));
      }
    } catch (error) {
      console.error("Proof upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const clearProof = () => {
    setNewCert(prev => ({ ...prev, proofUrl: "" }));
  };

  const addCertificate = () => {
    if (newCert.title && newCert.issuer) {
      const updated = [...certs, { ...newCert }];
      setCerts(updated);
      onChange(updated);
      setNewCert({ title: "", issuer: "", year: "", proofUrl: "" });
    }
  };

  const removeCertificate = (index: number) => {
    const updated = certs.filter((_, i) => i !== index);
    setCerts(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-300">Certificates & Awards</label>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Verifiable Proof Recommended</span>
      </div>
      
      <div className="space-y-3">
        {certs.map((cert, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group animate-fade-in hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${cert.proofUrl ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                {cert.proofUrl ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 11V7h4"/><path d="M11 13v4h4"/></svg>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">{cert.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500 font-medium">{cert.issuer} • {cert.year}</p>
                  {cert.proofUrl && <span className="text-[10px] font-black text-green-500/80 uppercase tracking-widest px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">Verified</span>}
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => removeCertificate(index)}
              title="Delete certificate"
              className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-400 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="14" y1="11" y2="17"/><line x1="14" x2="10" y1="11" y2="17"/></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-600 ml-1">Certificate Title</label>
            <input 
              type="text" 
              placeholder="e.g. AWS Certified Solutions Architect"
              value={newCert.title}
              onChange={(e) => setNewCert({...newCert, title: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-600 ml-1">Issuing Body</label>
            <input 
              type="text" 
              placeholder="e.g. Amazon Web Services"
              value={newCert.issuer}
              onChange={(e) => setNewCert({...newCert, issuer: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-32 space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-600 ml-1">Year</label>
            <input 
              type="text" 
              placeholder="2024"
              value={newCert.year}
              onChange={(e) => setNewCert({...newCert, year: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
          
          <div className="relative flex-1 w-full space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-600 ml-1">Credential Proof</label>
            <div className="flex gap-2">
              <input 
                type="file" 
                id="proof-upload"
                className="hidden" 
                accept="image/*,.pdf"
                onChange={handleUploadProof}
              />
              <label 
                htmlFor="proof-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed text-xs font-bold cursor-pointer transition-all ${newCert.proofUrl ? 'bg-blue-600/10 border-blue-600/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:border-white/20'}`}
              >
                {uploading ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : newCert.proofUrl ? (
                  <span className="flex items-center gap-2">✓ Certificate Attached</span>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> Add Proof Image</>
                )}
              </label>

              {newCert.proofUrl && (
                <button 
                  type="button"
                  onClick={clearProof}
                  className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all active:scale-90 flex items-center justify-center"
                  title="Remove proof"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                </button>
              )}
            </div>
          </div>

          <button 
            type="button"
            onClick={addCertificate}
            disabled={!newCert.title || !newCert.issuer || uploading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-black rounded-2xl px-8 py-3 shadow-2xl shadow-blue-600/20 transition-all active:scale-95 whitespace-nowrap"
          >
            Add to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
