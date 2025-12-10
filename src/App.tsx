import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { StoryView } from './components/StoryView';
import { processConversations, type AnalysisResult } from './utils/analysis';
import { motion, AnimatePresence } from 'framer-motion';

type Stage = 'landing' | 'processing' | 'story' | 'loading';

function App() {
  const [stage, setStage] = useState<Stage>('landing');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for data (base64) or ID in URL
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    const id = params.get('id');

    if (encoded) {
      try {
        const decoded = JSON.parse(atobURLSafe(encoded)) as AnalysisResult;
        setData(decoded);
        setStage('story');
      } catch (e) {
        console.error(e);
        setError("Could not decode shared data.");
        setStage('landing');
      }
      return;
    }

    if (id) {
      setStage('loading');
      fetch(`http://localhost:3000/api/wrapped/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Wrapped not found");
          return res.json();
        })
        .then((data: AnalysisResult) => {
          setData(data);
          setStage('story');
        })
        .catch(err => {
          console.error(err);
          setError("Could not load your Wrapped. It might have expired.");
          setStage('landing');
        });
    }
  }, []);

  const handleUpload = async (file: File, apiKey: string | null) => {
    try {
      setStage('processing');
      setError(null);
      
      const startTime = Date.now();
      const result = await processConversations(file, apiKey);
      
      const elapsed = Date.now() - startTime;
      const minDelay = 2000;
      
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
      }

      setData(result);
      setStage('story');
    } catch (err) {
      console.error(err);
      setError("Failed to parse file. Make sure it's a valid conversations.json from ChatGPT export.");
      setStage('landing');
    }
  };

  const handleReset = () => {
    // Clear URL param without reload
    window.history.pushState({}, '', '/');
    setStage('landing');
    setData(null);
    setError(null);
  };

  const atobURLSafe = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    return atob(normalized);
  };

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <motion.div 
            key="landing"
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full"
          >
            <Landing onUpload={handleUpload} isLoading={false} />
            {error && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded font-mono text-sm">
                {error}
              </div>
            )}
          </motion.div>
        )}

        {(stage === 'processing' || stage === 'loading') && (
           <motion.div 
             key="processing"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-brutal-bg z-50 flex flex-col items-center justify-center font-display text-center"
           >
             <div className="w-24 h-24 border-4 border-brutal-green border-t-transparent rounded-full animate-spin mb-8" />
             <h2 className="text-4xl font-black text-white uppercase animate-pulse">
               {stage === 'loading' ? 'Retrieving Records...' : 'Judging You...'}
             </h2>
             <p className="mt-4 text-gray-500 font-mono text-sm">
               {stage === 'loading' ? 'Fetching data from the archives' : 'Reading your deepest secrets'}
             </p>
           </motion.div>
        )}

        {stage === 'story' && data && (
          <motion.div 
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <StoryView data={data} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
