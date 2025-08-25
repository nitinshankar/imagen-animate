import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        AI Image Generator
      </h1>
      <p className="mt-3 text-lg text-gray-600">Craft visuals with the power of AI</p>
    </header>
  );
};