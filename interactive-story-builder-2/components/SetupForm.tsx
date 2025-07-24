
import React from 'react';
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
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg transition-all w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Your Story</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Tell us who and where, and we'll begin the tale.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="protagonist" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Protagonist
          </label>
          <input
            type="text"
            id="protagonist"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            placeholder="e.g., a curious fox named Finn"
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-transparent rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="setting" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Setting
          </label>
          <input
            type="text"
            id="setting"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            placeholder="e.g., an ancient, whispering forest"
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-transparent rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!canStart || isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Begin Adventure</span>
        </button>
      </form>
    </div>
  );
};
