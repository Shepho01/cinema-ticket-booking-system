import "./CarouselIcon.css";
import React from 'react';

const CarouselIcon = React.forwardRef((props, ref) => {
    return (
        <div className="carousel-icon">
            <img className="carousel-image" ref={ref} src={props.src} alt={props.alt} />
        </div>
    );
});

export default CarouselIcon;