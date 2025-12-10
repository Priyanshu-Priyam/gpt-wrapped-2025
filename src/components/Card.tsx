import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CardProps {
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
}

export const Card: React.FC<CardProps> = ({ children, onNext, onPrev }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#050505',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `chatgpt-wrapped-2025-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm aspect-[9/16] bg-brutal-bg rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={onNext}
      >
        <div ref={cardRef} className="w-full h-full relative p-6 flex flex-col">
          {children}
          
          {/* Watermark/Footer */}
          <div className="absolute bottom-6 left-0 w-full text-center z-20 pointer-events-none">
             <p className="text-[10px] font-bold tracking-[0.2em] opacity-30 uppercase">ChatGPT Wrapped 2025</p>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button 
            onClick={handleDownload}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full transition-colors group"
          >
            <Download className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        {/* Navigation Hit Areas */}
        <div className="absolute top-0 left-0 w-1/3 h-full z-10" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
        <div className="absolute top-0 right-0 w-1/3 h-full z-10" onClick={(e) => { e.stopPropagation(); onNext(); }} />
      </motion.div>
    </div>
  );
};

