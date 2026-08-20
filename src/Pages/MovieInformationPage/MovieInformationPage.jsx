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

const movieDataPoster = {
    "Sinners": {
      poster: sinnersPoster,      
    },

    "Spiderman-Across-the-Spider-Verse": {
      poster: spidermanPoster,
    },
    "Better-Man": {
      poster: betterManPoster,
    },
    "Mufasa-The-Lion-King": {
      poster: mufasaPoster,
    },

    "The-Greatest-Showman": {
      poster: greatestShowmanPoster,
    },

    "superman": {
      poster: supermanPoster,
    },

    "ballerina": {
      poster: ballerinaPoster,
    },

    "fantastic-4-first-steps": {
      poster: fantastic4Poster,
    },

    "f1": {
      poster: f1Poster,
    },

    "lilo-and-stitch": {
      poster: liloAndStitchPoster,
    }
}

const MovieInformationPage = () => {
  const { slug } = useParams();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieInformation = async () => {
      try {
        setLoading(true);
        setError("");

        const [movieResponse, showtimesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/movies/${slug}`),
          axios.get(
            `http://localhost:5000/movies/${slug}/showtimes`
          ),
        ]);

        setMovie(movieResponse.data.movie);
        setShowtimes(showtimesResponse.data.showtimes || []);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError("Movie not found.");
          } else {
            setError("Failed to fetch movie information.");
          }
        } else {
          setError(
            "Something went wrong. Make sure the backend is running."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieInformation();
  }, [slug]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!movie) {
    return <h2>Movie not found.</h2>;
  }

  const classificationIcon =
    classificationMap[movie.classification] || pgIcon;

  // Convert the API's flat showtime list into the structure
  // expected by DatePagination.
  const showtimesByDate = showtimes.reduce(
    (dates, showtime) => {
      let dateGroup = dates.find(
        (date) => date.label === showtime.show_date
      );

      if (!dateGroup) {
        dateGroup = {
          label: showtime.show_date,
          times: [],
        };

        dates.push(dateGroup);
      }

      dateGroup.times.push(showtime.start_time);

      return dates;
    },
    []
  );

  return (
    <div>
      <div className="movie-information-page">
        <img
          src={movieDataPoster[movie.slug].poster}
          alt={movie.name}
          style={{ width: "300px" }}
        />

        <div className="movie-information-page-details">
          <h1 className="movie-information-page-title">
            {movie.name}
          </h1>

          <div className="movie-information-page-classification">
            <img
              src={classificationIcon}
              alt={movie.classification}
              style={{ height: "35px" }}
            />

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
        <h1 className="movie-information-page-showtimes-title">
          Showtimes
        </h1>

        {showtimesByDate.length > 0 ? (
          <DatePagination dateData={showtimesByDate} />
        ) : (
          <p>No showtimes are currently available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieInformationPage;