import "./OrderCard.css";

function OrderCard({ booking }) {
  const bookingDate = new Date(
    booking.startsAt
  ).toLocaleDateString(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Australia/Sydney",
    }
  );

  const bookingTime = new Date(
    booking.startsAt
  ).toLocaleTimeString(
    "en-AU",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Australia/Sydney",
    }
  );

  return (
    <div className="order-card">

      <div className="order-card-header">

        <div>
          <h3 className="order-movie-title">
            {booking.movieName}
          </h3>

          <p className="order-booking-number">
            Booking #{booking.bookingId}
          </p>
        </div>

        <span
          className={`order-status ${booking.status}`}
        >
          {booking.status.toUpperCase()}
        </span>

      </div>


      <div className="order-divider" />


      <div className="order-details">

        <div className="order-detail">
          <span className="order-detail-label">
            Date
          </span>

          <span>
            {bookingDate}
          </span>
        </div>


        <div className="order-detail">
          <span className="order-detail-label">
            Time
          </span>

          <span>
            {bookingTime}
          </span>
        </div>


        <div className="order-detail">
          <span className="order-detail-label">
            Screen
          </span>

          <span>
            {booking.screenId}
          </span>
        </div>

      </div>


      <div className="order-seats-section">

        <span className="order-detail-label">
          Seats
        </span>

        <div className="order-seat-list">

          {booking.seats?.map((seat) => (
            <span
              key={seat.seatId}
              className="order-seat"
            >
              {seat.seatLabel}
            </span>
          ))}

        </div>

      </div>


      <div className="order-card-footer">

        <span>
          {booking.seats?.length || 0}{" "}
          {(booking.seats?.length || 0) === 1
            ? "seat"
            : "seats"}
        </span>

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