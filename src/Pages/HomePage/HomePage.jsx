import React, { useState } from 'react';
import './HomePage.css';
import MovieOption from '../../Components/MovieOption/MovieOption';
import { Link } from 'react-router-dom';
import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

// Now Showing Posters
import sinnersPoster from "../../assets/movie-posters/sinners-poster.png";
import spidermanPoster from "../../assets/movie-posters/spiderman.png";
import greatestShowmanPoster from "../../assets/movie-posters/greatest-showman.png";
import betterManPoster from "../../assets/movie-posters/better-man.png";
import mufasaPoster from "../../assets/movie-posters/mufasa.png"; 

// Coming Soon Posters
import supermanPoster from "../../assets/movie-posters/Superman.png";
import ballerinaPoster from "../../assets/movie-posters/ballerina.png";
import f1Poster from "../../assets/movie-posters/F1.png";
import fantastic4Poster from "../../assets/movie-posters/fantastic4.jpg";
import liloAndStitchPoster from "../../assets/movie-posters/lilo-and-stitch.png";

const movieOptions = [
  {
    link: "/movies/sinners",
    name: "Sinners",
    poster: sinnersPoster,
    classification: maIcon,
  },
  {
    link: "/movies/spiderman-across-the-spider-verse",
    name: "Spiderman Across the Spider-Verse",
    poster: spidermanPoster,
    classification: pgIcon,
  },
  {
    link: "/movies/better-man",
    name: "Better Man",
    poster: betterManPoster,
    classification: maIcon,
  },
  {
    link: "/movies/mufasa-the-lion-king",
    name: "Mufasa: The Lion King",
    poster: mufasaPoster,
    classification: pgIcon,
  },
  {
    link: "/movies/greatest-showman",
    name: "The Greatest Showman",
    poster: greatestShowmanPoster,
    classification: pgIcon,
  },
];


const comingSoonMovieOptions = [
  {
    name: "Superman",
    poster: supermanPoster,
    classification: mIcon,
    link: "/movies/superman",
  },
  {
    name: "Ballerina",
    poster: ballerinaPoster,
    classification: maIcon,
    link: "/movies/ballerina",
  },
  {
    name: "Fantastic 4: First Steps",
    poster: fantastic4Poster,
    classification: mIcon,
    link: "/movies/fantastic-4-first-steps",
  },
  {
    name: "F1",
    poster: f1Poster,
    classification: mIcon,
    link: "/movies/f1",
  },
  {
    name: "Lilo and Stitch",
    poster: liloAndStitchPoster,
    classification: pgIcon,
    link: "/movies/lilo-and-stitch",
  },
];


const HomePage = () => {
  const [showingNow, setShowingNow] = useState(true);
  const [comingSoon, setComingSoon] = useState(false);

  const toggleShowingNow = () => {
    setShowingNow(true);
    setComingSoon(false);
  };

  const toggleComingSoon = () => {
    setShowingNow(false);
    setComingSoon(true);
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
            {movieOptions.map((movie, index) => (
              <MovieOption
                key={index}
                link={movie.link}
                name={movie.name}
                poster={movie.poster}
                classification={movie.classification}
              />
            ))}

          </div>
        )}

        {comingSoon && (
          <div className="homepage-movies-page-movie">
            {comingSoonMovieOptions.map((movie, index) => (
              <MovieOption
                key={index}
                name={movie.name}
                poster={movie.poster}
                classification={movie.classification}
                link={movie.link}
              />
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
