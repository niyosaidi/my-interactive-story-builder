import React from 'react';
import { motion } from 'motion/react';
import { SparklesIcon } from './Icons';

interface SetupFormProps {
  protagonist: string;
  setProtagonist: (value: string) => void;
  setting: string;
  setSetting: (value: string) => void;
  onStart: () => void;
  isLoading: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({
  protagonist,
  setProtagonist,
  setting,
  setSetting,
  onStart,
  isLoading,
}) => {
  const canStart = protagonist.trim() !== '' && setting.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStart && !isLoading) {
      onStart();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 dark:bg-stone-900/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-serif"
        >
          Forge Your Chronicle
        </motion.h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2 text-lg italic">The ink awaits your first word...</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
        >
          <label htmlFor="protagonist" className="block text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
            The Hero
          </label>
          <input
            type="text"
            id="protagonist"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            placeholder="e.g., a curious fox named Finn"
            className="w-full px-6 py-4 bg-stone-100/50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-lg dark:text-white outline-none"
            disabled={isLoading}
          />
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
        >
          <label htmlFor="setting" className="block text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
            The Realm
          </label>
          <input
            type="text"
            id="setting"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="e.g., an ancient, whispering forest"
            className="w-full px-6 py-4 bg-stone-100/50 dark:bg-stone-800/50 border-2 border-stone-200 dark:border-stone-700/50 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-lg dark:text-white outline-none"
            disabled={isLoading}
          />
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          type="submit"
          disabled={!canStart || isLoading}
          whileHover={canStart ? { scale: 1.02, backgroundColor: '#d97706' } : {}}
          whileTap={canStart ? { scale: 0.98 } : {}}
          className="w-full flex items-center justify-center space-x-3 bg-amber-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg shadow-amber-600/30 disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:shadow-none disabled:cursor-not-allowed transition-all text-xl"
        >
          <SparklesIcon className="w-6 h-6" />
          <span>Begin Adventure</span>
        </motion.button>
      </form>
    </motion.div>
  );
};
