import sinnersPoster from "../../assets/movie-posters/sinners-poster.png";
import spidermanPoster from "../../assets/movie-posters/spiderman.png";
import blackPantherPoster from "../../assets/movie-posters/black-panther.png";
import greatestShowmanPoster from "../../assets/movie-posters/greatest-showman.png";
import dunePoster from "../../assets/movie-posters/dune-part-2.png";
import betterManPoster from "../../assets/movie-posters/better-man.png";
import badBoysPoster from "../../assets/movie-posters/bad-boys.png";
import toyStoryPoster from "../../assets/movie-posters/toy-story-4.png";  
import mufasaPoster from "../../assets/movie-posters/mufasa.png"; 
import supermanPoster from "../../assets/movie-posters/superman.png";
import ballerinaPoster from "../../assets/movie-posters/ballerina.png";
import fantastic4Poster from "../../assets/movie-posters/fantastic4.jpg";
import f1Poster from "../../assets/movie-posters/f1.png";
import liloAndStitchPoster from "../../assets/movie-posters/lilo-and-stitch.png";


import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./MovieInformationPage.css";
import DatePagination from "./DataPagination.jsx";

// Keep these local mappings for icons/posters (recommended)
import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

const classificationMap = {
  G: gIcon,
  PG: pgIcon,
  M: mIcon,
  MA: maIcon,
  "MA15+": maIcon,
};

const movieData = {
    "Sinners": {
      poster: sinnersPoster,
      classification: maIcon,
      release_date: "17/04/2025",
      run_time: "2 hrs 17 min",
      director: "Ryan Coogler",
      cast: ["Michael B. Jordan", "Hailee Steinfeld", "Miles Caton"],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Spiderman-Across-the-Spider-Verse": {
      name: "Spiderman Across the Spider-Verse",
      poster: spidermanPoster,
      classification: pgIcon,
      run_time: "2 hrs 0 min",
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "Miles Morales swings across dimensions with new Spider-heroes.",
      classification_details: "Mild animated violence and coarse language",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Better-Man": {
      name: "Better Man",
      poster: betterManPoster,
      classification: maIcon,
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "A biographical film exploring the life of a legendary musician.",
      classification_details: "Strong coarse language and drug use",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "Mufasa-The-Lion-King": {
      name: "Mufasa: The Lion King",
      poster: mufasaPoster,
      classification: pgIcon,
      cast: ["Oscar Issac", "Shameieek Moore", "Hailee Steinfeld"],
      description: "Discover the untold origin story of the king of the Pride Lands.",
      classification_details: "Mild animated violence and coarse language",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
    },
    "The-Greatest-Showman": {
      name: "The Greatest Showman",
      poster: greatestShowmanPoster,
      classification: pgIcon,
      cast: ["Hugh Jackman", "Zac Efron", "Michelle Williams", "Zendaya"],
      description: "A musical about P.T. Barnum’s creation of show business.",
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
    ]
      
    },

    "superman": {
      name: "Superman",
      poster: supermanPoster,
      classification: mIcon,
      classification_details: "Mild animated violence and coarse language",
      description: "Superman faces the challenges in a world where hope is not valued.",
      director: "James Gunn",
      cast: ["David Corensweat", "Nicholas Hault", "Nathan Fillion" ],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
      ]
    },

    "ballerina": {
      name: "Ballerina",
      poster: ballerinaPoster,
      classification: maIcon,
      classification_details: "Strong violence and coarse language",
      overview: "Vengeance is a dance in this action-packed thriller where a ballerina seeks justice for her murdered family.",
      director: "Len Wiseman",
      cast: ["Ana de Armas", "Keanu Reeves", "Norman Reedus" ],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
      ]
    },

    "fantastic-4-first-steps": {
      name: "Fantastic 4: First Steps",
      poster: fantastic4Poster,
      classification: mIcon,
      classification_details: "Moderate violence and coarse language",
      overview: "The iconic superhero family faces a threat from an outer space entity.",
      director: "Matt Shakman",
      cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn", "Ebon Moss-Bachrach" ],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
      ]
    },

    "f1": {
      name: "F1",
      poster: f1Poster,
      classification: mIcon,
      classification_details: "Mature themes and coarse language",
      overview: "Experience the thrill of Formula 1 racing with this high-octane film.",
      director: "Joseph Kosinski",
      cast: ["Brad Pitt", "Damson Idris", "Javiar Bardem" ],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
      ]
    },

    "lilo-and-stitch": {
      name: "Lilio and Stitch",
      poster: liloAndStitchPoster,
      classification: pgIcon,
      classification_details: "Parental guidance recommended",
      overview: "Experience the heartwarming story of Lilo and Stitch in this live action remake.",
      director: "-------------",
      cast: ["++++", "-----", "======" ],
      showtimes: [
      { label: "17/06", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "18/06", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
      { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
      { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
      { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
      { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
      { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
      { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
      { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
      ]
    }
}

const MovieInformationPage = () => {
  const { slug } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/movies/${slug}`
      );

      setMovie(res.data.movie);

      

    } catch (err) {
      if (err.response) {
        // Server responded with error (e.g. 404)
        if (err.response.status === 404) {
          setError("Movie not found.");
        } else {
          setError("Failed to fetch movie.");
        }
      } else {
        // Network error
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchMovie();
}, [slug]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!movie) return <h2>Movie not found.</h2>;

  const classificationIcon = classificationMap[movie.classification] || pgIcon;
  console.log("Fetched movie data:", movie);
  return (
    <div>
      <div className="movie-information-page">
        {/* poster_url recommended from backend OR keep poster_key mapping */}
        <img src={movieData[movie.slug].poster} alt={movie.name} style={{ width: "300px" }} />

        <div className="movie-information-page-details">
          <h1 className="movie-information-page-title">{movie.name}</h1>

          <div className="movie-information-page-classification">
            <img src={classificationIcon} alt={movie.name} style={{ height: "35px" }} />
            <p>{movie.classification_details}</p>
          </div>

          <h2>Overview</h2>
          <p className="overview">{movie.overview}</p>

          <h2>Director</h2>
          <p>{movie.director}</p>

          <h2>Cast</h2>
          <p>{(movie.cast_members || []).join(", ")}</p>
        </div>
      </div>

      <div>
        <h1 className="movie-information-page-showtimes-title">Showtimes</h1>
        {/* {<DatePagination dateData={movie.showtimes || []} />} */}
      </div>
    </div>
  );
};

export default MovieInformationPage;







