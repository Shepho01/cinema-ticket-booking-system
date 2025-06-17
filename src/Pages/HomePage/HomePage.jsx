import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [showingNow, setShowingNow] = useState(true);
  const [comingSoon, setComingSoon] = useState(false);

  const toggleShowingNow = () => {
    setShowingNow(true);
    setComingSoon(false);
    console.log('Now Showing clicked');
  };

  const toggleComingSoon = () => {
    setShowingNow(false);
    setComingSoon(true);
    console.log('Coming Soon clicked');
  };

  return (
    <div>
      <div className="homepage-showing-options">
        <h1
          onClick={toggleShowingNow}
          className={`homepage-option ${showingNow ? 'active' : ''}`}
        >
          Now Showing
        </h1>
        <h1
          onClick={toggleComingSoon}
          className={`homepage-option ${comingSoon ? 'active' : ''}`}
        >
          Coming Soon
        </h1>
      </div>

      <div className="homepage-movies-section">
        {showingNow && (
          <div className="homepage-movies-page-movie">
            <div>Sinners</div>
            <div>Spiderman across the spiderverse</div>
            <div>Black Panther</div>
            <div>The Greatest Showman</div>
            <div>Dune Part 2</div>
            <div>Better Man</div>
            <div>Bad Boys</div>
            <div>Toy Story 4</div>
            <div>Mufasa the Lion King</div>
          </div>
        )}

        {comingSoon && (
          <div className="homepage-movies-page-movie">
       
            <p>Superman</p>
            <p>Ballerina</p>
            <p>F1</p>
            <p>Fantastic 4: First Steps</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
