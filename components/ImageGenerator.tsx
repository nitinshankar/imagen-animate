import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImage, getPromptSuggestions, animateImageToVideo } from '../services/geminiService';
import type { AspectRatio } from '../types';
import { ASPECT_RATIO_OPTIONS } from '../types';
import { GlassCard } from './GlassCard';
import { Loader, VideoLoader } from './Loader';

const ImagePlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8 space-y-3">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-lg font-medium">Your generated image will appear here</p>
    <p className="text-sm">Describe what you want to create and let the magic happen.</p>
  </div>
);

// Custom hook to detect clicks outside a specified element
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(suggestionsRef, () => {
    setShowSuggestions(false);
  });

  useEffect(() => {
    if (prompt.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handler = setTimeout(async () => {
      const fetchedSuggestions = await getPromptSuggestions(prompt);
      if (fetchedSuggestions.length > 0) {
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [prompt]);

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedVideoUrl(null); // Reset video URL
    setShowSuggestions(false);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  const handleAnimate = useCallback(async () => {
    if (!prompt.trim() || !generatedImage) {
      setError('A prompt and a generated image are required to animate.');
      return;
    }
    setIsAnimating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const videoUrl = await animateImageToVideo(prompt, generatedImage);
      setGeneratedVideoUrl(videoUrl);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during animation.';
      setError(errorMessage);
    } finally {
      setIsAnimating(false);
    }
  }, [prompt, generatedImage]);
  
  const renderDisplayContent = () => {
    if (isAnimating) return <VideoLoader />;
    if (isLoading) return <Loader />;
    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                <h3 className="font-bold mb-2">An Error Occurred</h3>
                <p className="text-sm">{error}</p>
            </div>
        );
    }
    if (generatedVideoUrl) {
        return (
            <video
                src={generatedVideoUrl}
                className="w-full h-full object-contain"
                autoPlay loop muted playsInline
            />
        );
    }
    if (generatedImage) {
        return (
            <img
                src={generatedImage}
                alt={prompt}
                className="w-full h-full object-contain rounded-lg"
            />
        );
    }
    return <ImagePlaceholder />;
  };

  return (
    <GlassCard className="w-full max-w-4xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
      {/* Left side: Controls */}
      <div className="flex flex-col space-y-6 lg:w-1/2">
        <div className="relative" ref={suggestionsRef}>
          <label htmlFor="prompt" className="block text-md font-medium text-gray-700 mb-2">
            Describe your vision
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="e.g., A cinematic shot of a racoon astronaut floating in space, surrounded by sparkling donuts"
            className="w-full h-36 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 text-gray-900 resize-none"
            disabled={isLoading || isAnimating}
            autoComplete="off"
          />
           {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
              <ul className="py-1 max-h-48 overflow-y-auto">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
            <label htmlFor="aspectRatio" className="block text-md font-medium text-gray-700 mb-2">
                Aspect Ratio
            </label>
             <div className="relative">
                <select
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    disabled={isLoading || isAnimating}
                    className="w-full appearance-none p-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900"
                >
                    {ASPECT_RATIO_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || isAnimating}
          className="w-full py-3 text-lg font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shine-button"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
        
        {generatedImage && !isLoading && (
          <div className="border-t pt-6">
            <button
              onClick={handleAnimate}
              disabled={isAnimating}
              className="w-full py-3 text-lg font-semibold text-white rounded-lg bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shine-button"
            >
              {isAnimating ? 'Animating...' : '✨ Animate Image'}
            </button>
          </div>
        )}
      </div>

      {/* Right side: Display */}
      <div className="lg:w-1/2 flex items-center justify-center aspect-square">
        <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
            {renderDisplayContent()}
        </div>
      </div>
    </GlassCard>
  );
};
