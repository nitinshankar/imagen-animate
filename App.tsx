import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageGenerator } from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-100 text-gray-800 antialiased">
      <style>
        {`
          .shine-button {
            position: relative;
            overflow: hidden;
          }
          .shine-button::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 80%);
            transform: translateX(-100%) skewX(-20deg);
            transition: transform 0.85s cubic-bezier(0.23, 1, 0.32, 1);
          }
          .shine-button:hover::after {
            transform: translateX(100%) skewX(-20deg);
          }
        `}
      </style>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <ImageGenerator />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;