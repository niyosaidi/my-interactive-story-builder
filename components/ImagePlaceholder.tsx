import React from 'react';
import { ImageIcon } from './Icons';

export const ImagePlaceholder: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center mb-4 animate-pulse">
        <ImageIcon className="w-12 h-12 text-stone-400 dark:text-stone-500" />
    </div>
  );
};