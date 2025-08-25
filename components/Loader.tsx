import React, { useState, useEffect } from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4 text-gray-800 p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    <p className="text-md font-medium text-gray-600 tracking-wider">
      Generating your image...
    </p>
  </div>
);

const VIDEO_MESSAGES = [
  "Warming up the animation engine...",
  "Storyboarding your scene...",
  "Rendering initial frames...",
  "Compositing layers and effects...",
  "Almost there, adding final touches...",
];

export const VideoLoader: React.FC = () => {
  const [message, setMessage] = useState(VIDEO_MESSAGES[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % VIDEO_MESSAGES.length;
      setMessage(VIDEO_MESSAGES[index]);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-gray-800 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      <p className="text-md font-medium text-gray-600 tracking-wider text-center">
        {message}
      </p>
       <p className="text-sm text-gray-500">(This can take a few minutes)</p>
    </div>
  );
};
