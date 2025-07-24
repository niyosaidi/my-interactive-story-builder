
import React, { useRef, useEffect } from 'react';
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
    <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl shadow-lg w-full h-[75vh] flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {history.map((part) => (
          <div key={part.id}>
            {part.type === 'ai' && (
              <div>
                {part.imageLoading && <ImagePlaceholder />}
                {part.imageUrl && (
                  <img 
                    src={part.imageUrl} 
                    alt="A scene from the story" 
                    className="w-full aspect-video object-cover rounded-lg mb-4 shadow-md border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {part.content}
                </div>
              </div>
            )}
            {part.type === 'user' && (
              <div className="flex justify-end">
                <p className="inline-block bg-sky-600 text-white font-medium px-4 py-2 rounded-xl rounded-br-none">
                  {part.content}
                </p>
              </div>
            )}
            {part.type === 'system' && (
                <p className="text-center text-sm text-slate-400 dark:text-slate-500 italic">
                    {part.content}
                </p>
            )}

            {part.choices && part.choices.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="font-sans font-semibold text-slate-800 dark:text-slate-200">What do you do next?</p>
                {part.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectChoice(choice, index)}
                    className="w-full text-left font-sans p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-sky-100 dark:hover:bg-slate-700 hover:border-sky-300 dark:hover:border-sky-500 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <span className="font-medium text-sky-700 dark:text-sky-400 mr-2">{index + 1}.</span>
                    {choice}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && !history[history.length - 1]?.choices?.length && (
            <div className="flex items-center space-x-3">
                <LoadingIndicator />
                <span className="text-slate-500 dark:text-slate-400 font-serif italic">The storyteller is thinking...</span>
            </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};