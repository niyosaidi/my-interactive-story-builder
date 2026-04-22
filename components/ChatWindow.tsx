import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StoryPart } from '../types';
import { LoadingIndicator } from './LoadingIndicator';
import { ImagePlaceholder } from './ImagePlaceholder';

interface ChatWindowProps {
  history: StoryPart[];
  onSelectChoice: (choiceText: string, choiceIndex: number) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ history, onSelectChoice, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  return (
    <div className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl w-full h-[75vh] flex flex-col border border-stone-200/50 dark:border-stone-800/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 space-y-12 scrollbar-hide">
        <AnimatePresence initial={false}>
          {history.map((part, index) => (
            <motion.div 
              key={part.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              {(part.type === 'ai' || part.type === 'system') && (
                <div className="space-y-6">
                  {part.imageLoading && (
                    <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                       <ImagePlaceholder />
                    </div>
                  )}
                  {part.imageUrl && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="w-full shadow-2xl rounded-2xl overflow-hidden border-4 border-white dark:border-stone-800"
                    >
                      <img 
                        src={part.imageUrl} 
                        alt="A scene from the story" 
                        className="w-full aspect-[21/9] object-cover hover:scale-105 transition-transform duration-10000 linear"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                  
                  <div className={`max-w-none ${part.type === 'system' ? 'text-center' : ''}`}>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      className={`font-serif text-stone-800 dark:text-stone-100 leading-relaxed whitespace-pre-wrap ${part.type === 'system' ? 'text-xl italic opacity-70' : 'text-xl sm:text-2xl pt-2'}`}
                    >
                      {part.content}
                    </motion.div>
                  </div>
                </div>
              )}

              {part.type === 'user' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <p className="bg-amber-600/10 text-amber-700 dark:text-amber-400 font-medium px-6 py-3 rounded-full border border-amber-600/30 text-lg">
                    {part.content}
                  </p>
                </motion.div>
              )}

              {part.choices && part.choices.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 space-y-4 max-w-2xl mx-auto"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800"></div>
                    <p className="font-sans font-bold text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500">Choice</p>
                    <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {part.choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectChoice(choice, i)}
                        className="group w-full text-left font-sans p-5 bg-white dark:bg-stone-800/80 rounded-2xl border-2 border-stone-100 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-full text-sm font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            {i + 1}
                          </span>
                          <span className="text-stone-700 dark:text-stone-300 group-hover:text-amber-900 dark:group-hover:text-amber-100 text-lg transition-colors">
                            {choice}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && !history[history.length - 1]?.choices?.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 py-8"
            >
                <LoadingIndicator />
                <span className="text-stone-500 dark:text-stone-400 font-serif italic text-lg animate-pulse">
                  The chronicle unfolds...
                </span>
            </motion.div>
        )}
        <div ref={endOfMessagesRef} className="h-20" />
      </div>
    </div>
  );
};
