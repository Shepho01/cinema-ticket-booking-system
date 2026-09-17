import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./WatchlistCard.css";

function WatchlistCard({
  movie,
  onRemove,
}) {
  const navigate = useNavigate();

  const [removing, setRemoving] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleRemove = async () => {
    try {
      setRemoving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/watchlist/${movie.movieId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to remove movie"
        );
      }

      onRemove(movie.movieId);

    } catch (err) {
      console.error(
        "Failed to remove movie:",
        err
      );

      setError(err.message);

    } finally {
      setRemoving(false);
    }
  };


  return (
    <div className="watchlist-card">

      <div className="watchlist-card-content">

        <h3 className="watchlist-card-title">
          {movie.name}
        </h3>

        <p className="watchlist-card-classification">
          {movie.classification}
        </p>

        <p className="watchlist-card-overview">
          {movie.overview}
        </p>

        {error && (
          <p className="watchlist-card-error">
            {error}
          </p>
        )}

      </div>


      <div className="watchlist-card-actions">

        <button
          className="watchlist-view-button"
          onClick={() =>
            navigate(`/movies/${movie.slug}`)
          }
        >
          VIEW MOVIE
        </button>

        <button
          className="watchlist-remove-button"
          onClick={handleRemove}
          disabled={removing}
        >
          {removing
            ? "REMOVING..."
            : "REMOVE"}
        </button>

      </div>

    </div>
  );
}

export default WatchlistCard;