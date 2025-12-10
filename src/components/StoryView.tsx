import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { IntroCard, TimelineCard, ObsessionCard, PersonalityCard, ReceiptsCard, SummaryCard } from './StoryCards';
import type { AnalysisResult } from '../utils/analysis';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface StoryViewProps {
  data: AnalysisResult;
  onReset: () => void;
}

const CARDS = [
  IntroCard,
  TimelineCard,
  ObsessionCard,
  PersonalityCard,
  ReceiptsCard,
  SummaryCard
];

export const StoryView: React.FC<StoryViewProps> = ({ data, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const CurrentCardComponent = CARDS[currentIndex];

  const handleNext = () => {
    if (currentIndex < CARDS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    
    // Longer duration for text-heavy cards
    const duration = [0, 3, 4, 5].includes(currentIndex) ? 8000 : 5000;
    
    const timer = setTimeout(() => {
       if (currentIndex < CARDS.length - 1) {
         setCurrentIndex(prev => prev + 1);
       }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-brutal-bg">
        <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-brutal-green/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-brutal-pink/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full h-full max-w-md md:max-h-[90vh] md:aspect-[9/16] flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1 h-1">
          {CARDS.map((_, idx) => (
            <div key={idx} className="h-full flex-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: currentIndex > idx ? '100%' : '0%' }}
                animate={{ width: currentIndex > idx ? '100%' : currentIndex === idx ? '100%' : '0%' }}
                transition={currentIndex === idx ? { duration: [0, 3, 4, 5].includes(idx) ? 8 : 5, ease: "linear" } : { duration: 0 }}
                className="h-full bg-white"
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={onReset}
          className="absolute top-8 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Card Container */}
        <div 
          className="flex-1 w-full h-full"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, x: 100, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: -100, scale: 0.95 }}
               transition={{ duration: 0.3 }}
               className="w-full h-full"
             >
               <Card onNext={handleNext} onPrev={handlePrev}>
                 <CurrentCardComponent data={data} />
               </Card>
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Controls Hint */}
        <div className="hidden md:flex justify-between w-full px-8 pb-8 text-white/20 text-xs font-mono uppercase tracking-widest pointer-events-none">
           <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Prev</div>
           <div className="flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></div>
        </div>
      </div>
    </div>
  );
};
