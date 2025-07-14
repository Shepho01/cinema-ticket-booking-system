import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Removed direct DOM access to prevent errors in React

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  };


  // Use a ref to access the image element
  const imageRef = React.useRef(null);

  return (
    <div className="carousel-wrapper">
      <div className='carousel-cover-left'>
      </div>

      <div className="carousel-cover-right">
      </div>

      <div className="carousel">
        
        <button className="carousel-button left" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-button right" onClick={nextSlide}>
          &#10095;
        </button>

        <div className="carousel-track-container" style={{ overflow: 'hidden' }}>
          <div
            className="carousel-track"
            style={{
              display: 'flex',
              transition: 'transform 0.5s',
              transform: `translateX(-${currentIndex * (imageRef.current ? imageRef.current.offsetWidth : 0)}px)`
            }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                className="carousel-image"
                src={src}
                alt={`slide-${index}`}
                style={{ flexShrink: 0 }}
                ref={index === 0 ? imageRef : null}
              />
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Carousel;
