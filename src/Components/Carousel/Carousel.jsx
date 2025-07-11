import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageElement = document.querySelector('.carousel-image');

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      console.log('newIndex:', newIndex);
      return newIndex;
    });

  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      // Get the image width from CSS
      
      const imageWidth = imageElement ? imageElement.offsetWidth : 0;
      console.log('newIndex:', newIndex, 'imageWidth:', imageWidth);

      return newIndex;
    });
  };


  // Use a ref to access the image element
  const imageRef = React.useRef(null);

  return (
    <div className="carousel-wrapper">
      <div className='carousel-cover-left'></div>
      <div className='carousel-cover-right'></div>

      <div className="carousel">
        <button className="carousel-button left" onClick={prevSlide}>
          &#10094;
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

        <button className="carousel-button right" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
