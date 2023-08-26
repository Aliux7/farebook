import React, { useState } from 'react';
import '../styles/index.css'

const ManualCarousel = ({ mediaURLs }) => {
  if (mediaURLs.length <= 1) {
    return mediaURLs[0].endsWith('.mkv') || mediaURLs[0].endsWith('.mp4') ? (
      <video controls autoPlay width="600" height="600">
        <source src={mediaURLs[0]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        src={mediaURLs[0]}
        alt={`Media 1`}
        className='postImage'
        style={{display: 'block' }}
      />
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? mediaURLs.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === mediaURLs.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={handlePrev}
        style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginLeft: '10px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#60;
      </div>
      {mediaURLs[currentIndex].endsWith('.mkv') || mediaURLs[currentIndex].endsWith('.mp4') ? (
        <video controls autoPlay  width="600" height="600">
          <source src={mediaURLs[currentIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={mediaURLs[currentIndex]}
          alt={`Media ${currentIndex + 1}`}
          className='postImage'
          style={{display: 'block' }}
        />
      )}
      <div
        onClick={handleNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '0',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontSize: '24px',
          backgroundColor: 'var(--button_background)',
          padding: '3px 10px',
          borderRadius: '50%',
          marginRight: '10px',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        &#62;
      </div>
    </div>
  );
};

export default ManualCarousel;
