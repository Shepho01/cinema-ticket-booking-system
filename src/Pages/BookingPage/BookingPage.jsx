import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import "./BookingPage.css";


// CLASSIFICATION ICONS
import gIcon from "../../assets/classification/G.png";
import pgIcon from "../../assets/classification/PG.png";
import mIcon from "../../assets/classification/M.png";
import maIcon from "../../assets/classification/MA.png";


// BOOKING COMPONENTS
import ConfirmationSection
  from "../../Components/ConfirmationSection/ConfirmationSection.jsx";

import SeatsSelection
  from "../../Components/SeatsSelection/SeatsSelection.jsx";

import PaymentSection
  from "../../Components/PaymentSection/PaymentSection.jsx";

import TicketsSection
  from "../../Components/TicketsSection/TicketsSection.jsx";


// NOW SHOWING POSTERS
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


// COMING SOON POSTERS
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


// MAP BACKEND POSTER KEYS TO FRONTEND ASSETS
const posterMap = {
  "Sinners": sinnersPoster,

  "Spiderman-Across-the-Spider-Verse":
    spidermanPoster,

  "Better-Man": betterManPoster,

  "The-Greatest-Showman":
    greatestShowmanPoster,

  "Mufasa-The-Lion-King":
    mufasaPoster,

  "superman": supermanPoster,

  "ballerina": ballerinaPoster,

  "f1": f1Poster,

  "fantastic-4-first-steps":
    fantastic4Poster,

  "lilo-and-stitch":
    liloAndStitchPoster,
};


// MAP BACKEND CLASSIFICATION TO ICON
const classificationMap = {
  G: gIcon,
  PG: pgIcon,
  M: mIcon,
  MA: maIcon,
  "MA15+": maIcon,
};


const BookingPage = () => {

  const {
    slug,
    showtimeId,
    date,
    time,
  } = useParams();


  const navigate = useNavigate();


  // CURRENT BOOKING STEP
  const [
    currentSection,
    setCurrentSection,
  ] = useState(1);


  // MOVIE
  const [
    movie,
    setMovie,
  ] = useState(null);

  const [
    loadingMovie,
    setLoadingMovie,
  ] = useState(true);


  // SHOWTIME
  const [
    showtime,
    setShowtime,
  ] = useState(null);


  // SEATS
  const [
    seats,
    setSeats,
  ] = useState([]);

  const [
    selectedSeatIds,
    setSelectedSeatIds,
  ] = useState([]);

  const [
    loadingSeats,
    setLoadingSeats,
  ] = useState(true);


  // TICKETS
  const [
    totalTicketsSelected,
    setTotalTicketsSelected,
  ] = useState(0);


  // ERROR
  const [
    error,
    setError,
  ] = useState("");


  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingError, setBookingError] = useState("");



  // =========================================================
  // FETCH MOVIE INFORMATION
  // =========================================================

  useEffect(() => {

    const fetchMovie = async () => {
      try {

        setLoadingMovie(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/movies/${slug}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch movie"
          );
        }

        setMovie(data.movie);

      } catch (err) {

        console.error(
          "Failed to fetch movie:",
          err
        );

        setError(err.message);

      } finally {

        setLoadingMovie(false);

      }
    };


    if (slug) {
      fetchMovie();
    }

  }, [slug]);



  // =========================================================
  // FETCH SHOWTIME + SEAT AVAILABILITY
  // =========================================================

  useEffect(() => {

    const fetchSeats = async () => {
      try {

        setLoadingSeats(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/showtimes/${showtimeId}/seats`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch seats"
          );
        }

        setShowtime(
          data.showtime
        );

        setSeats(
          data.seats
        );

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



  // =========================================================
  // SELECTED SEATS
  // =========================================================

  const selectedCount =
    selectedSeatIds.length;


  const handleSelect = (seatId) => {

    setSelectedSeatIds(
      (currentSelectedSeats) => {

        // If seat is already selected,
        // remove it
        if (
          currentSelectedSeats.includes(
            seatId
          )
        ) {
          return currentSelectedSeats.filter(
            (id) => id !== seatId
          );
        }


        // Otherwise add it
        return [
          ...currentSelectedSeats,
          seatId,
        ];

      }
    );
  };



  // =========================================================
  // CONFIRM PAYMENT
  // =========================================================

  const handleConfirmPayment = async () => {
    if (selectedSeatIds.length === 0) {
      setBookingError(
        "Please select at least one seat."
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const response = await fetch(
        "http://localhost:5000/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            showtimeId: Number(showtimeId),
            seatIds: selectedSeatIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to create booking"
        );
      }

      console.log(
        "Booking created successfully:",
        data.booking
      );

      navigate("/profile");

    } catch (err) {
      console.error(
        "Failed to create booking:",
        err
      );

      setBookingError(err.message);

    } finally {
      setBookingLoading(false);
    }
  };



  // =========================================================
  // BOOKING PAGE NAVIGATION
  // =========================================================

  const goToPrev = () => {

    setCurrentSection(
      (prev) =>
        Math.max(
          prev - 1,
          1
        )
    );

  };


  const goToNext = () => {

    setCurrentSection(
      (prev) =>
        Math.min(
          prev + 1,
          4
        )
    );

  };



  // =========================================================
  // RENDER CURRENT BOOKING STEP
  // =========================================================

  const renderSection = () => {

    switch (currentSection) {

      // SEATS
      case 1:
        return (
          <SeatsSelection
            seats={seats}
            selectedSeatIds={
              selectedSeatIds
            }
            onSelect={
              handleSelect
            }
          />
        );


      // TICKETS
      case 2:
        return (
          <TicketsSection
            setTotalTicketsSelected={
              setTotalTicketsSelected
            }
            selectedCount={
              selectedCount
            }
          />
        );


      // PAYMENT
      case 3:
        return (
          <PaymentSection />
        );


      // CONFIRMATION
      case 4:
        return (
          <ConfirmationSection />
        );


      default:
        return null;
    }

  };



  // =========================================================
  // LOADING / ERROR CHECKS
  //
  // IMPORTANT:
  // These come AFTER all hooks.
  // =========================================================

  if (
    loadingMovie ||
    loadingSeats
  ) {
    return (
      <h2>
        Loading booking...
      </h2>
    );
  }


  if (error) {
    return (
      <div className="booking-page-container">
        <p>
          {error}
        </p>
      </div>
    );
  }


  if (!movie) {
    return (
      <h2>
        Movie not found.
      </h2>
    );
  }


  if (!showtime) {
    return (
      <h2>
        Showtime not found.
      </h2>
    );
  }



  // =========================================================
  // IMAGE LOOKUPS
  //
  // Safe here because movie is no longer null.
  // =========================================================

  const moviePoster =
    posterMap[movie.slug];


  const classificationIcon =
    classificationMap[
      movie.classification
    ];



  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="booking-page-container">


      {/* MOVIE / SHOWTIME INFORMATION */}

      <div className="booking-information-page">

        <img
          src={moviePoster}
          alt={movie.name}
          style={{
            width: "215px",
          }}
        />


        <div className="booking-information-page-details">


          <h1 className="booking-information-page-title">
            {movie.name}
          </h1>


          <div className="booking-information-page-classification">

            {classificationIcon && (
              <img
                src={classificationIcon}
                alt={
                  movie.classification
                }
                style={{
                  height: "30px",
                }}
              />
            )}


            <p>
              {
                movie.classification_details
              }
            </p>

          </div>


          <div className="booking-information-page-classification">

            <p>
              <strong>
                Date:
              </strong>{" "}
              {
                decodeURIComponent(
                  date
                )
              }
            </p>


            <p>
              <strong>
                Time:
              </strong>{" "}
              {
                decodeURIComponent(
                  time
                )
              }
            </p>


            <p>
              <strong>
                Screen:
              </strong>{" "}
              {
                showtime.screenId
              }
            </p>


            <p>
              <strong>
                Price:
              </strong>{" "}
              $
              {
                showtime.ticketPrice
              }
            </p>

          </div>

        </div>

      </div>



      {/* BOOKING STEP NAVIGATION */}

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



      {/* CURRENT BOOKING SECTION */}
      <div className="booking-section-content">
        {renderSection()}
      </div>



      {/* SELECTED SEAT COUNT */}
      <p className="selected-seats-info">
        <strong>
          Selected Seats:
        </strong>{" "}
        {selectedCount}
      </p>

      {/* BACK / NEXT BUTTONS */}
      <div className="booking-section-navigation-buttons">

        <button
          className="booking-section-navigation-back"

          onClick={
            goToPrev
          }

          disabled={
            currentSection === 1
          }
        >
          BACK
        </button>

        <button
          className={`booking-section-navigation-next ${
            selectedCount === 0 ||
            bookingLoading ||
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
            bookingLoading ||
            (
              currentSection === 2 &&
              totalTicketsSelected !== selectedCount
            )
          }
        >
          {currentSection === 4
            ? bookingLoading
              ? "PROCESSING..."
              : "CONFIRM PAYMENT"
            : "NEXT"}
        </button>


      </div>


    </div>
  );
};


export default BookingPage;