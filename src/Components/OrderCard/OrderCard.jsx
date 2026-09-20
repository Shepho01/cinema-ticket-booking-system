import { useState } from "react";
import "./OrderCard.css";


function OrderCard({
  booking,
  onCancel,
}) {
  const [cancelling, setCancelling] =
    useState(false);

  const [error, setError] =
    useState("");


  // Convert showtime date/time to Sydney time
  const startsAt = booking.startsAt
    ? new Date(booking.startsAt)
    : null;


  const formattedDate = startsAt
    ? startsAt.toLocaleDateString(
        "en-AU",
        {
          timeZone: "Australia/Sydney",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "N/A";


  const formattedTime = startsAt
    ? startsAt.toLocaleTimeString(
        "en-AU",
        {
          timeZone: "Australia/Sydney",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "N/A";


  const seats = booking.seats || [];


  const handleCancel = async () => {
    try {
      setCancelling(true);
      setError("");

      await onCancel(
        booking.bookingId
      );

    } catch (err) {
      console.error(
        "Failed to cancel booking:",
        err
      );

      setError(
        err.message ||
        "Failed to cancel booking"
      );

    } finally {
      setCancelling(false);
    }
  };


  return (
    <div className="order-card">

      {/* HEADER */}
      <div className="order-card-header">

        <div>
          <h2 className="order-movie-title">
            {booking.movieName}
          </h2>

          <p className="order-booking-number">
            Booking #{booking.bookingId}
          </p>
        </div>


        <span
          className={`order-status ${
            booking.status?.toLowerCase()
          }`}
        >
          {booking.status?.toUpperCase()}
        </span>

      </div>


      {/* BOOKING INFORMATION */}
      <div className="order-card-details">

        <div className="order-detail">
          <strong>Date</strong>

          <span>
            {formattedDate}
          </span>
        </div>


        <div className="order-detail">
          <strong>Time</strong>

          <span>
            {formattedTime}
          </span>
        </div>


        <div className="order-detail">
          <strong>Screen</strong>

          <span>
            {booking.screenId}
          </span>
        </div>

      </div>


      {/* SEATS */}
      <div className="order-seats-section">

        <strong>Seats</strong>

        <div className="order-seat-list">

          {seats.length > 0 ? (
            seats.map((seat) => (
              <span
                key={seat.seatId}
                className="order-seat"
              >
                {seat.seatLabel}
              </span>
            ))
          ) : (
            <span>
              No seats found
            </span>
          )}

        </div>

      </div>


      {/* ERROR */}
      {error && (
        <p className="order-cancel-error">
          {error}
        </p>
      )}


      {/* FOOTER */}
      <div className="order-card-footer">

        <span className="order-seat-count">
          {seats.length}{" "}
          {seats.length === 1
            ? "seat"
            : "seats"}
        </span>


        {/* Only confirmed bookings
            can be cancelled */}
        {booking.status === "confirmed" && (
          <button
            className="order-cancel-button"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling
              ? "CANCELLING..."
              : "CANCEL BOOKING"}
          </button>
        )}


        <div className="order-total">

          <span>Total</span>

          <strong>
            $
            {Number(
              booking.totalPrice
            ).toFixed(2)}
          </strong>

        </div>

      </div>

    </div>
  );
}


export default OrderCard;