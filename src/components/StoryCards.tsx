import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../utils/analysis';
import { AlertTriangle, Clock, Terminal, Zap, Share2, Skull, Flame, Biohazard } from 'lucide-react';
import { clsx } from 'clsx';

interface CardContentProps {
  data: AnalysisResult;
}

// 1. INTRO CARD
export const IntroCard: React.FC<CardContentProps> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-center relative">
      <motion.div 
        animate={{ y: [-20, 0, -20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-transparent absolute" style={{ top: `${i * 15}%`, left: -20 }}>
            2025
          </div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4">The Year You Asked</h2>
        <h1 className="text-7xl font-black text-brutal-green mb-8 leading-[0.8] tracking-tighter shadow-green-glow">
          THE<br />MACHINE
        </h1>
        
        <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm rounded-lg">
          <p className="text-sm font-bold uppercase text-gray-400 mb-1">Total Interactions</p>
          <p className="text-6xl font-mono font-bold text-white tabular-nums">
            {data.totalPrompts.toLocaleString()}
          </p>
        </div>

        <p className="mt-8 text-xl font-bold text-gray-400 italic">
          "That’s more than you talked to your mother."
        </p>
      </motion.div>
    </div>
  );
};

// 2. TIMELINE CARD
export const TimelineCard: React.FC<CardContentProps> = ({ data }) => {
  const isLateNight = data.peakHour < 5 || data.peakHour > 22;
  
  return (
    <div className="h-full flex flex-col justify-between py-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-brutal-pink">The Grind</h2>
        <p className="text-lg font-bold text-gray-400">Peak Productivity Hour</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Clock className="w-24 h-24 text-brutal-pink mb-4 animate-pulse-fast" />
        <h1 className="text-8xl font-black tabular-nums tracking-tighter">
          {data.peakHour}:00
        </h1>
        <p className="text-xl font-bold bg-white text-black px-2 py-1 uppercase -rotate-2 mt-4 inline-block">
          {isLateNight ? "Late Night Doomscrolling" : "Optimizing Reality"}
        </p>
      </div>

      <p className="text-center font-mono text-xs opacity-50">
        While the world slept, you were prompting.
      </p>
    </div>
  );
};

// 3. OBSESSION CARD
export const ObsessionCard: React.FC<CardContentProps> = ({ data }) => {
  const topTopic = data.topTopics[0] || { word: 'Nothing', count: 0 };
  
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex flex-wrap content-center justify-center opacity-10 gap-4 rotate-12 scale-150 pointer-events-none">
         {Array.from({ length: 20 }).map((_, i) => (
           <span key={i} className="text-4xl font-black uppercase text-gray-500">{topTopic.word}</span>
         ))}
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xl font-bold text-white uppercase tracking-widest mb-4">You are obsessed with</p>
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase break-words leading-[0.9]">
          {topTopic.word}
        </h1>
        <div className="mt-8 bg-brutal-green text-black font-bold px-4 py-2 text-xl inline-block transform -rotate-3">
          {topTopic.count} mentions
        </div>
      </div>
      
      <p className="absolute bottom-20 text-center font-bold text-gray-400 w-3/4">
        "Are you okay? Do you need to talk to a human about this?"
      </p>
    </div>
  );
};

// 4. GEN Z MBTI CARD (Replaces VibeCard)
export const PersonalityCard: React.FC<CardContentProps> = ({ data }) => {
  const persona = data.persona || { 
    genZArchetype: "NPC", 
    genZDescription: "Loading personality...", 
    title: "Unknown" 
  };

  return (
    <div className="h-full flex flex-col items-center justify-center py-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
      <div className="w-full relative">
         <div className="absolute -top-10 -left-10 w-40 h-40 bg-brutal-pink/30 rounded-full blur-[50px]" />
         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brutal-green/30 rounded-full blur-[50px]" />
         
         <div className="text-center relative z-10">
           <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Your Gen Z Personality Type</h3>
           
           <motion.div 
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: "spring", bounce: 0.5 }}
             className="border-4 border-white bg-black/50 backdrop-blur-md p-6 my-6 transform -rotate-2"
           >
             <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brutal-pink to-indigo-400 uppercase leading-tight mb-4">
               {persona.genZArchetype}
             </h1>
             <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
           </motion.div>

           <p className="text-xl font-bold text-white px-6 leading-relaxed">
             "{persona.genZDescription}"
           </p>
         </div>

         <div className="mt-12 grid grid-cols-2 gap-4 px-4">
            <div className="bg-white/10 p-3 rounded text-center">
              <span className="block text-xs text-gray-400 uppercase mb-1">Aesthetic</span>
              <span className="font-bold text-brutal-green">Cyber Y2K</span>
            </div>
            <div className="bg-white/10 p-3 rounded text-center">
               <span className="block text-xs text-gray-400 uppercase mb-1">Content Diet</span>
               <span className="font-bold text-brutal-pink">{persona.contentDiet || "Brainrot"}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

// 5. SPICY / RECEIPTS CARD (New)
export const ReceiptsCard: React.FC<CardContentProps> = ({ data }) => {
  return (
    <div className="h-full bg-black flex flex-col justify-center items-center relative overflow-hidden p-6 text-center border-4 border-red-600">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ff000010_10px,#ff000010_20px)]" />
      
      <motion.div 
         animate={{ rotate: [0, -5, 5, 0] }}
         transition={{ repeat: Infinity, duration: 2 }}
      >
        <Skull className="w-20 h-20 text-red-600 mb-6" />
      </motion.div>
      
      <h2 className="text-3xl font-black text-white uppercase bg-red-600 px-4 py-1 transform -skew-x-12 mb-8">
        WE CAUGHT YOU
      </h2>
      
      <div className="relative bg-zinc-900 p-6 rounded-lg border border-zinc-700 shadow-2xl max-w-xs transform rotate-2">
         <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rotate-12">
            EXPOSED
         </div>
         <p className="font-mono text-lg text-red-400 font-bold mb-4">
            "{data.persona?.exposedSecret || "You're hiding something."}"
         </p>
         <div className="w-full h-px bg-zinc-700 my-4" />
         <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>EVIDENCE #404</span>
            <span>VERIFIED</span>
         </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Your Toxic Trait</p>
        <h3 className="text-2xl font-black text-white italic">
           "{data.persona?.toxicTrait}"
        </h3>
      </div>
    </div>
  );
};

// 6. TOXICITY SUMMARY CARD (Modified Summary)
export const SummaryCard: React.FC<CardContentProps> = ({ data }) => {
  const toxicity = data.persona?.toxicityScore || 0;
  
  const getToxicityColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="h-full flex flex-col py-8">
      <h1 className="text-4xl font-black text-white uppercase text-center mb-6">2025<br/><span className="text-brutal-green">WRAPPED</span></h1>
      
      <div className="flex-1 w-full space-y-4">
         {/* Toxicity Meter */}
         <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
                 <Biohazard className="w-3 h-3" /> Toxicity Score
               </span>
               <span className={`text-3xl font-black ${getToxicityColor(toxicity)}`}>{toxicity}%</span>
            </div>
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${toxicity}%` }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className={`h-full ${toxicity > 70 ? 'bg-red-600' : 'bg-green-500'}`}
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-[10px] text-gray-400 uppercase">Interactions</p>
              <p className="text-xl font-black text-white">{data.totalPrompts}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-[10px] text-gray-400 uppercase">Peak Hour</p>
              <p className="text-xl font-black text-white">{data.peakHour}:00</p>
            </div>
            <div className="col-span-2 bg-brutal-pink/10 border border-brutal-pink/20 p-3 rounded-lg">
              <p className="text-[10px] text-brutal-pink uppercase">Archetype</p>
              <p className="text-lg font-bold text-white">{data.persona?.genZArchetype}</p>
            </div>
         </div>
      </div>

      <div className="mt-auto text-center">
        <p className="text-sm font-bold text-gray-400 mb-4">Share the damage.</p>
        <button className="bg-white text-black font-black uppercase px-8 py-3 rounded-full flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-transform">
          <Share2 className="w-4 h-4" />
          Share Image
        </button>
      </div>
    </div>
  );
};
