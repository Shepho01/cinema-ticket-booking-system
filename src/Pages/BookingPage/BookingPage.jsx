import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./BookingPage.css";

import ConfirmationSection
  from "../../Components/ConfirmationSection/ConfirmationSection.jsx";
import SeatsSelection
  from "../../Components/SeatsSelection/SeatsSelection.jsx";
import PaymentSection
  from "../../Components/PaymentSection/PaymentSection.jsx";
import TicketsSection
  from "../../Components/TicketsSection/TicketsSection.jsx";

import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";

// Now Showing Posters
import sinnersPoster
  from "../../assets/movie-posters/sinners-poster.png";
import spidermanPoster
  from "../../assets/movie-posters/spiderman.png";
import greatestShowmanPoster
  from "../../assets/movie-posters/greatest-showman.png";
import betterManPoster
  from "../../assets/movie-posters/better-man.png";
import mufasaPoster
  from "../../assets/movie-posters/mufasa.png";

// Coming Soon Posters
import supermanPoster
  from "../../assets/movie-posters/Superman.png";
import ballerinaPoster
  from "../../assets/movie-posters/ballerina.png";
import f1Poster
  from "../../assets/movie-posters/F1.png";
import fantastic4Poster
  from "../../assets/movie-posters/fantastic4.jpg";
import liloAndStitchPoster
  from "../../assets/movie-posters/lilo-and-stitch.png";

const BookingPage = () => {
  const {
    slug,
    showtimeId,
    date,
    time,
  } = useParams();

  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState(1);

  const [showtime, setShowtime] = useState(null);

  const [seats, setSeats] = useState([]);

  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const [totalTicketsSelected, setTotalTicketsSelected] = useState(0);

  const [loadingSeats, setLoadingSeats] = useState(true);

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [error, setError] = useState("");

  const movieData = {
    Sinners: {
      name: "Sinners",
      poster: sinnersPoster,
      classification: maIcon,
      overview:
        "Trying to leave their troubled lives behind, twin brothers (Michael B. Jordan) return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
      release_date: "17/04/2025",
      run_time: "2 hrs 17 min",
      director: "Ryan Coogler",
      classification_details:
        "Strong horror violence, blood and gore and sex scenes",
    },

    "Spiderman-Across-the-Spider-Verse": {
      name: "Spiderman Across the Spider-Verse",
      poster: spidermanPoster,
      classification: pgIcon,
      run_time: "2 hrs 0 min",
      description:
        "Miles Morales swings across dimensions with new Spider-heroes.",
      classification_details:
        "Mild animated violence and coarse language",
    },

    "Better-Man": {
      name: "Better Man",
      poster: betterManPoster,
      classification: maIcon,
      description:
        "A biographical film exploring the life of a legendary musician.",
      classification_details:
        "Strong coarse language and drug use",
    },

    "Mufasa-The-Lion-King": {
      name: "Mufasa: The Lion King",
      poster: mufasaPoster,
      classification: pgIcon,
      description:
        "Discover the untold origin story of the king of the Pride Lands.",
      classification_details:
        "Mild animated violence and coarse language",
    },

    "The-Greatest-Showman": {
      name: "The Greatest Showman",
      poster: greatestShowmanPoster,
      classification: pgIcon,
      description:
        "A musical about P.T. Barnum’s creation of show business.",
    },

    superman: {
      name: "Superman",
      poster: supermanPoster,
      classification: mIcon,
    },

    f1: {
      name: "F1",
      poster: f1Poster,
      classification: mIcon,
    },

    ballerina: {
      name: "Ballerina",
      poster: ballerinaPoster,
      classification: maIcon,
    },

    "fantastic-4-first-steps": {
      name: "Fantastic 4: First Steps",
      poster: fantastic4Poster,
      classification: mIcon,
    },

    "lilo-and-stitch": {
      name: "Lilo and Stitch",
      poster: liloAndStitchPoster,
      classification: pgIcon,
    },
  };

  const movie = movieData[slug];

  // Fetch real seats from backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/showtimes/${showtimeId}/seats`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch seats"
          );
        }

        setShowtime(data.showtime);
        setSeats(data.seats);
      } catch (err) {
        console.error(
          "Failed to fetch seats:",
          err
        );

        setError(err.message);
      } finally {
        setLoadingSeats(false);
      }
    };

    if (showtimeId) {
      fetchSeats();
    }
  }, [showtimeId]);

  // Number of seats currently selected
  const selectedCount =
    selectedSeatIds.length;

  // Select / deselect a seat
  const handleSelect = (seatId) => {
    setSelectedSeatIds(
      (currentSelectedSeats) => {
        if (
          currentSelectedSeats.includes(
            seatId
          )
        ) {
          return currentSelectedSeats.filter(
            (id) => id !== seatId
          );
        }

        return [
          ...currentSelectedSeats,
          seatId,
        ];
      }
    );
  };

  const handleConfirmPayment = async () => {
  // POST selectedSeatIds to /bookings

  // only if successful
  navigate("/profile");
};

  const goToPrev = () => {
    setCurrentSection((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const goToNext = () => {
    setCurrentSection((prev) =>
      Math.min(prev + 1, 4)
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        if (loadingSeats) {
          return <p>Loading seats...</p>;
        }

        return (
          <SeatsSelection
            seats={seats}
            selectedSeatIds={
              selectedSeatIds
            }
            onSelect={handleSelect}
          />
        );

      case 2:
        return (
          <TicketsSection
            setTotalTicketsSelected={
              setTotalTicketsSelected
            }
            selectedCount={selectedCount}
          />
        );

      case 3:
        return <PaymentSection />;

      case 4:
        return (
          <ConfirmationSection />
        );

      default:
        return null;
    }
  };

  if (!movie) {
    return <h2>Movie not found.</h2>;
  }

  if (error && !showtime) {
    return (
      <div className="booking-page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="booking-page-container">

      <div className="booking-information-page">

        <img
          src={movie.poster}
          alt={movie.name}
          style={{ width: "215px" }}
        />

        <div className="booking-information-page-details">

          <h1 className="booking-information-page-title">
            {movie.name}
          </h1>

          <div className="booking-information-page-classification">

            <img
              src={movie.classification}
              alt={movie.name}
              style={{ height: "30px" }}
            />

            <p>
              {movie.classification_details}
            </p>

          </div>

          <div className="booking-information-page-classification">

            <p>
              <strong>Date:</strong>{" "}
              {decodeURIComponent(date)}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {decodeURIComponent(time)}
            </p>

            {showtime && (
              <>
                <p>
                  <strong>
                    Screen:
                  </strong>{" "}
                  {showtime.screenId}
                </p>

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ${showtime.ticketPrice}
                </p>
              </>
            )}

          </div>

        </div>

      </div>

      <div className="booking-section-navigation">

        <h2
          className={
            currentSection === 1
              ? "active-step"
              : ""
          }
        >
          Seats
        </h2>

        <h2
          className={
            currentSection === 2
              ? "active-step"
              : ""
          }
        >
          Tickets
        </h2>

        <h2
          className={
            currentSection === 3
              ? "active-step"
              : ""
          }
        >
          Payment
        </h2>

        <h2
          className={
            currentSection === 4
              ? "active-step"
              : ""
          }
        >
          Confirmation
        </h2>

      </div>

      <div className="booking-section-content">
        {renderSection()}
      </div>

      <p className="selected-seats-info">
        <strong>
          Selected Seats:
        </strong>{" "}
        {selectedCount}
      </p>

      <div className="booking-section-navigation-buttons">

        <button
          className="booking-section-navigation-back"
          onClick={goToPrev}
          disabled={
            currentSection === 1
          }
        >
          BACK
        </button>

        <button
          className={`booking-section-navigation-next ${
            selectedCount === 0 ||
            (
              currentSection === 2 &&
              totalTicketsSelected !== selectedCount
            )
              ? "disabled-button"
              : ""
          }`}

          onClick={
            currentSection === 4
              ? handleConfirmPayment
              : goToNext
          }

          disabled={
            selectedCount === 0 ||
            (
              currentSection === 2 &&
              totalTicketsSelected !== selectedCount
            )
          }
        >
          {currentSection === 4
            ? "CONFIRM PAYMENT"
            : "NEXT"}
        </button>

      </div>

    </div>
  );
};

export default BookingPage;