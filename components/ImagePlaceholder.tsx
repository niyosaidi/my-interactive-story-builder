import React from 'react';
import { ImageIcon } from './Icons';

export const ImagePlaceholder: React.FC = () => {
  return (
    <div className="w-full aspect-[21/9] bg-stone-200 dark:bg-stone-800 rounded-2xl flex items-center justify-center animate-pulse border-2 border-stone-100 dark:border-stone-700">
        <ImageIcon className="w-12 h-12 text-stone-400 dark:text-stone-600" />
    </div>
  );
};