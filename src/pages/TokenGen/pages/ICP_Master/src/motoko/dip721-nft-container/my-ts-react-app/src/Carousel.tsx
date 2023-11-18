// Carousel.tsx
import React, { useState, useEffect } from 'react';
import Card from './card';

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canisterIds = ['id1', 'id2', 'id3']; // Replace with your actual canister IDs

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % canisterIds.length);
    }, 3000); // Switch every 3 seconds
    return () => clearInterval(interval);
  }, [currentIndex, canisterIds.length]);

  return (
    <div className="container">
      {canisterIds.map((id, index) => (
        <input key={index} type="radio" name="slider" id={id} checked={index === currentIndex} />
      ))}
      <div className="cards">
        {canisterIds.map((id, index) => (
          <Card key={index} id={id} title={`Default Title ${index + 1}`} subtitle="Subtitle" time="4.05" imageSrc="defaultImageSrc" />
        ))}
      </div>
      <div className="player">
        {/* Your player content */}
      </div>
    </div>
  );
};

export default Carousel;
