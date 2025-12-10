import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Lock, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface LandingProps {
  onUpload: (file: File, apiKey: string | null) => void;
  isLoading: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onUpload, isLoading }) => {
  const [apiKey, setApiKey] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0], apiKey || null);
    }
  }, [onUpload, apiKey]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0], apiKey || null);
    }
  };

  return (
    <div className="min-h-screen bg-brutal-bg text-white flex flex-col items-center justify-center p-4 font-display overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brutal-green/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brutal-pink/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full z-10 flex flex-col items-center text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-2 tracking-tighter uppercase leading-[0.9]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutal-green to-emerald-400">Expose</span>
          <br />
          <span className="text-white">Yourself.</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold mb-12 text-gray-400 tracking-wide">
          2025 WRAPPED
        </p>

        <div 
          className={clsx(
            "w-full max-w-md border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer relative overflow-hidden group",
            isDragging ? "border-brutal-green bg-brutal-green/10 scale-105" : "border-gray-700 hover:border-gray-500"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept=".json"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-brutal-green" />
                </motion.div>
              ) : (
                <Upload className="w-8 h-8 text-gray-300 group-hover:text-brutal-green transition-colors" />
              )}
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg">Drop your conversations.json</p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider text-left">
              Claude API Key (Optional for Deep Roast)
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant..."
              className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-brutal-pink transition-colors font-mono text-sm"
            />
            <p className="text-[10px] text-gray-500 mt-2 text-left">
              Leave empty for "Simulated Demo Mode"
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Processing happens locally. Your secrets stay with you.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

