import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { StoryPart, GameState } from './types';
import { SetupForm } from './components/SetupForm';
import { ChatWindow } from './components/ChatWindow';
import { BookIcon, RestartIcon } from './components/Icons';

const API_KEY = process.env.API_KEY;

// Create the AI client instance once.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_INSTRUCTION = `You are a creative and intelligent storyteller AI building an interactive story with a human user. This is a progressive narrative experience. Follow these rules strictly:

1.  **Initial Setup:** The user's first message will be in the format: "Start a story with protagonist: [Protagonist's Name]. The setting is: [Setting Description]." Use this information to write a single, vivid opening paragraph that introduces the protagonist in that setting. After this paragraph, you MUST immediately provide three numbered choices for the user.

2.  **Story Progression:** After the initial setup, the user will only reply with a single number: 1, 2, or 3. This number corresponds to the choice they've made from the list you provided. Based on their selection, write the next single paragraph of the story.

3.  **Choice Generation:** After writing ANY story paragraph (both the opening one and all subsequent ones), you MUST STOP narrating and present the user with exactly three new, creative, and logical choices for what the protagonist can do next.

4.  **Choice Format:** Always format the choices on new lines, as a numbered list. Example:
What should [Protagonist] do?
1. [Choice 1]
2. [Choice 2]
3. [Choice 3]

5.  **Memory and Consistency:** Remember all previous parts of the story and the user's choices. Maintain perfect continuity. Do not contradict established facts. Refer back to earlier events, characters, or discoveries to create a coherent and meaningful narrative.

6.  **Style:** Write in a descriptive, imaginative, and engaging style suitable for a general audience. Keep paragraphs concise. Do not use markdown for formatting like bold or italics.`;

// This is a pure function, so it can live outside the component.
const parseAIResponse = (text: string): { storyText: string; choices: string[] } => {
  const choiceRegex = /^\s*1\./m;
  const choiceStartIndex = text.search(choiceRegex);
  
  let storyText = text;
  let choices: string[] = [];

  if (choiceStartIndex !== -1) {
    const storyPart = text.substring(0, choiceStartIndex).trim();
    const choicesPart = text.substring(choiceStartIndex);

    const choiceLineRegex = /^\s*\d+\.\s*(.*)/gm;
    let match;
    while ((match = choiceLineRegex.exec(choicesPart)) !== null) {
      choices.push(match[1].trim());
    }

    if (choices.length > 0) {
      storyText = storyPart;
    }
  }
  return { storyText, choices };
};


export default function App() {
  const [gameState, setGameState] = useState<GameState>(API_KEY ? 'SETUP' : 'ERROR');
  const [storyHistory, setStoryHistory] = useState<StoryPart[]>([]);
  const [protagonist, setProtagonist] = useState('');
  const [setting, setSetting] = useState('');
  const chatRef = useRef<Chat | null>(null);

  const generateImage = useCallback(async (storyText: string): Promise<string | null> => {
    if (!ai) return null;
    try {
      const imagePrompt = `A vivid, digital painting in a storybook style, depicting the following scene: ${storyText}. The image should be rich in detail, with a sense of wonder and adventure. Cinematic lighting.`;
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });
      const base64Image = response.generatedImages[0]?.image?.imageBytes;
      return base64Image ? `data:image/jpeg;base64,${base64Image}` : null;
    } catch (error) {
      console.error("Failed to generate image:", error);
      return null;
    }
  }, []);

  const processAIResponse = useCallback(async (stream: AsyncGenerator<any, any, undefined>, aiMessageId: string) => {
    let streamedText = '';
    for await (const chunk of stream) {
      streamedText += chunk.text;
      setStoryHistory(prev => prev.map(p => p.id === aiMessageId ? { ...p, content: streamedText } : p));
    }

    const { storyText, choices } = parseAIResponse(streamedText);
    setStoryHistory(prev => prev.map(p => 
      p.id === aiMessageId ? { ...p, content: storyText, choices, imageLoading: true } : p
    ));
    setGameState('STORY');

    const imageUrl = await generateImage(storyText);
    setStoryHistory(prev => prev.map(p => 
      p.id === aiMessageId ? { ...p, imageUrl: imageUrl ?? undefined, imageLoading: false } : p
    ));
  }, [generateImage]);

  const handleStartStory = useCallback(async () => {
    if (!protagonist || !setting || !ai) return;

    setGameState('LOADING');
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      chatRef.current = chat;
      
      const initialPrompt = `Start a story with protagonist: ${protagonist}. The setting is: ${setting}.`;
      const firstUserMessage: StoryPart = {
        id: crypto.randomUUID(),
        type: 'system',
        content: `Once upon a time, in ${setting}, lived ${protagonist}...`,
      };
      const initialAiMessage: StoryPart = { id: crypto.randomUUID(), type: 'ai', content: '' };
      setStoryHistory([firstUserMessage, initialAiMessage]);

      const stream = await chat.sendMessageStream({ message: initialPrompt });
      await processAIResponse(stream, initialAiMessage.id);

    } catch (error) {
      console.error("Failed to start story:", error);
      setGameState('ERROR');
    }
  }, [protagonist, setting, processAIResponse]);

  const handleSelectChoice = useCallback(async (choiceText: string, choiceIndex: number) => {
    if (!chatRef.current) return;
    setGameState('LOADING');

    const userMessage: StoryPart = { id: crypto.randomUUID(), type: 'user', content: choiceText };
    const nextAiMessage: StoryPart = { id: crypto.randomUUID(), type: 'ai', content: '' };
    setStoryHistory(prev => [...prev.map(p => ({ ...p, choices: [] })), userMessage, nextAiMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: String(choiceIndex + 1) });
      await processAIResponse(stream, nextAiMessage.id);
    } catch (error) {
      console.error("Failed to continue story:", error);
      setGameState('ERROR');
    }
  }, [processAIResponse]);

  const handleReset = useCallback(() => {
    setGameState('SETUP');
    setStoryHistory([]);
    setProtagonist('');
    setSetting('');
    chatRef.current = null;
  }, []);
  
  const renderContent = () => {
    switch(gameState) {
      case 'SETUP':
        return (
          <SetupForm
            protagonist={protagonist}
            setProtagonist={setProtagonist}
            setting={setting}
            setSetting={setSetting}
            onStart={handleStartStory}
            isLoading={false}
          />
        );
      case 'STORY':
      case 'LOADING':
        return (
            <ChatWindow
                history={storyHistory}
                onSelectChoice={handleSelectChoice}
                isLoading={gameState === 'LOADING'}
            />
        );
      case 'ERROR':
        return (
            <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 border border-red-400 rounded-lg">
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">API Error</h2>
                <p className="mt-2 text-red-700 dark:text-red-300">
                    Could not connect to the story service. Please ensure the API key is configured correctly in your environment.
                </p>
            </div>
        );
    }
  };

  return (
    <div className="font-sans text-stone-800 dark:text-stone-200 min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-3xl mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Interactive Story Builder
          </h1>
        </div>
        {(gameState === 'STORY' || gameState === 'LOADING') && (
          <button
            onClick={handleReset}
            aria-label="Start a new story"
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-50 dark:focus:ring-offset-stone-900 focus:ring-amber-500 transition-colors"
          >
            <RestartIcon className="w-4 h-4" />
            <span>New Story</span>
          </button>
        )}
      </header>
      <main className="w-full max-w-3xl">
        {renderContent()}
      </main>
    </div>
  );
}