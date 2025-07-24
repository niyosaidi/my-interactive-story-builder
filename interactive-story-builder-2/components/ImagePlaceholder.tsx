
import React from 'react';
import { ImageIcon } from './Icons';

export const ImagePlaceholder: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4 animate-pulse">
        <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
    </div>
  );
};