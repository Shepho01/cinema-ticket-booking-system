import React, { useEffect, useState } from "react";
import "./HomePage.css";
import MovieOption from "../../Components/MovieOption/MovieOption";

import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

import Carousel from "../../Components/Carousel/Carousel";

// Movie posters
import sinnersPoster from "../../assets/movie-posters/sinners-poster.png";
import spidermanPoster from "../../assets/movie-posters/spiderman.png";
import greatestShowmanPoster from "../../assets/movie-posters/greatest-showman.png";
import betterManPoster from "../../assets/movie-posters/better-man.png";
import mufasaPoster from "../../assets/movie-posters/mufasa.png";
import supermanPoster from "../../assets/movie-posters/Superman.png";
import ballerinaPoster from "../../assets/movie-posters/ballerina.png";
import f1Poster from "../../assets/movie-posters/F1.png";
import fantastic4Poster from "../../assets/movie-posters/fantastic4.jpg";

// Movie banners
import supermanBanner from "../../assets/movie-banners/superman_banner.png";
import sinnersBanner from "../../assets/movie-banners/sinners_banner.png";
import fantastic4Banner from "../../assets/movie-banners/fantastic4_banner.png";

const posterMap = {
  sinners: sinnersPoster,
  spiderman: spidermanPoster,
  betterman: betterManPoster,
  greatestshowman: greatestShowmanPoster,
  mufasa: mufasaPoster,
  superman: supermanPoster,
  ballerina: ballerinaPoster,
  f1: f1Poster,
  fantastic4: fantastic4Poster,
};

const classificationMap = {
  G: gIcon,
  PG: pgIcon,
  M: mIcon,
  MA: maIcon,
  "MA15+": maIcon,
};

const images = [supermanBanner, sinnersBanner, fantastic4Banner];

function normalizeKey(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const HomePage = () => {
  const [releaseStatus, setReleaseStatus] = useState("now_showing");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/movies?status=${releaseStatus}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        setMovies(data.movies);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(
            "Could not load movies. Make sure the backend is running."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => controller.abort();
  }, [releaseStatus]);

  return (
    <div>
      <Carousel images={images} />

      <div className="homepage-showing-options">
        <h1
          onClick={() => setReleaseStatus("now_showing")}
          className={`homepage-option ${
            releaseStatus === "now_showing" ? "active" : ""
          }`}
        >
          Now Showing
        </h1>

        <h1
          onClick={() => setReleaseStatus("coming_soon")}
          className={`homepage-option ${
            releaseStatus === "coming_soon" ? "active" : ""
          }`}
        >
          Coming Soon
        </h1>
      </div>

      <div className="homepage-movies-section">
        {loading && <p>Loading movies...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="homepage-movies-page-movie">
            {movies.map((movie) => (
              <MovieOption
                key={movie.id}
                link={movie.link || `/movies/${movie.slug}`}
                name={movie.name}
                poster={posterMap[normalizeKey(movie.poster_key)]}
                classification={classificationMap[movie.classification]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;