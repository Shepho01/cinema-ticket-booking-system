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
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import "./MovieInformationPage.css";
import DatePagination from "./DataPagination.jsx";

// Keep these local mappings for icons/posters (recommended)
import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

const classificationMap = {
  "G": gIcon,
  "PG": pgIcon,
  "M": mIcon,
  "MA15+": maIcon,
};

const movieDataPoster = {
    "Sinners": {poster: sinnersPoster},
    
    "Spiderman-Across-the-Spider-Verse": {poster: spidermanPoster},

    "Better-Man": {poster: betterManPoster},

    "Mufasa-The-Lion-King": {poster: mufasaPoster},

    "The-Greatest-Showman": {poster: greatestShowmanPoster},

    "superman": {poster: supermanPoster},

    "ballerina": {poster: ballerinaPoster},

    "fantastic-4-first-steps": {poster: fantastic4Poster},

    "f1": {poster: f1Poster},

    "lilo-and-stitch": {poster: liloAndStitchPoster}
}

const MovieInformationPage = () => {
  const { slug } = useParams();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { member } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState("");

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!member || !movie) {
        setIsInWatchlist(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/watchlist",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch watchlist"
          );
        }

        const movieAlreadySaved =
          data.watchlist.some(
            (item) =>
              item.movieId === movie.id
          );

        setIsInWatchlist(
          movieAlreadySaved
        );

      } catch (err) {
        console.error(
          "Failed to check watchlist:",
          err
        );
      }
    };

    checkWatchlist();

  }, [member, movie]);

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

  const handleWatchlist = async () => {
    if (!member) {
      navigate("/sign-in");
      return;
    }

    try {
      setWatchlistLoading(true);
      setWatchlistError("");

      const response = await fetch(
        `http://localhost:5000/watchlist/${movie.id}`,
        {
          method:
            isInWatchlist
              ? "DELETE"
              : "POST",

          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to update watchlist"
        );
      }

      setIsInWatchlist(
        !isInWatchlist
      );

    } catch (err) {
      console.error(
        "Watchlist update failed:",
        err
      );

      setWatchlistError(
        err.message
      );

    } finally {
      setWatchlistLoading(false);
    }
  };

  const classificationIcon = classificationMap[movie.classification];

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

      dateGroup.times.push({
        id: showtime.id,
        time: showtime.start_time,
      });

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

        <button
          className="watchlist-button"
          onClick={handleWatchlist}
          disabled={watchlistLoading}
        >
          {watchlistLoading
            ? "UPDATING..."
            : isInWatchlist
              ? "REMOVE FROM WATCHLIST"
              : "ADD TO WATCHLIST"}
        </button>

        {watchlistError && (
            <p className="watchlist-error">
              {watchlistError}
            </p>
          )}
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