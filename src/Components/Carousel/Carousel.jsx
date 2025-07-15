import React, { useState, useEffect } from 'react';
import './Carousel.css';

import CarouselIcon from './CarouselIcon.jsx';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use a ref to access the  element
  const imageRef = React.useRef(null);
  
  const carousel = document.querySelector('.carousel-image');

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return newIndex;
    });

    console.log("currentIndex", images);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });

    console.log("currentRef", images);

    console.log("carousel", carousel.height);
  };




  return (
    <div className="carousel-wrapper">

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
              <CarouselIcon
                key={index}
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
