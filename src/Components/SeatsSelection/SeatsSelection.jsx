import "./SeatsSelection.css";

const SeatsSelection = ({
  seats,
  selectedSeatIds,
  onSelect,
}) => {
  // Wait until seat data has been received
  if (!seats || !Array.isArray(seats)) {
    return <p>Loading seat data...</p>;
  }

  // Group the flat array of seats into rows.
  //
  // For example:
  //
  // [
  //   { seatRow: "A", seatLabel: "A1" },
  //   { seatRow: "A", seatLabel: "A2" },
  //   { seatRow: "B", seatLabel: "B1" }
  // ]
  //
  // becomes:
  //
  // {
  //   A: [A1, A2],
  //   B: [B1]
  // }

  const seatsByRow = seats.reduce(
    (rows, seat) => {
      if (!rows[seat.seatRow]) {
        rows[seat.seatRow] = [];
      }

      rows[seat.seatRow].push(seat);

      return rows;
    },
    {}
  );

  return (
    <div>
      {/* SEAT LEGEND */}
      <div className="seat-legend">

        <div className="seat-legend-item">
          <div className="legend-box legend-available"></div>
          <span>Available</span>
        </div>

        <div className="seat-legend-item">
          <div className="legend-box legend-unavailable"></div>
          <span>Unavailable</span>
        </div>

        <div className="seat-legend-item">
          <div className="legend-box legend-selected"></div>
          <span>Selected</span>
        </div>

      </div>

      {/* CINEMA SCREEN */}
      <h2 className="seats-selection-cinema-screen">
        CINEMA SCREEN
      </h2>

      {/* SEATS */}
      <div className="seats-grid">

        {Object.entries(seatsByRow).map(
          ([row, rowSeats]) => (

            <div
              className="seats-row"
              key={row}
            >

              {rowSeats.map((seat) => {

                const isSelected =
                  selectedSeatIds.includes(
                    seat.seatId
                  );

                let seatClass = "available";

                // Backend decides whether
                // the seat is already booked
                if (!seat.isAvailable) {
                  seatClass = "unavailable";
                }

                // React decides whether
                // the current user selected it
                else if (isSelected) {
                  seatClass = "selected";
                }

                return (
                  <div
                    key={seat.seatId}

                    className={`seat ${seatClass}`}

                    onClick={() => {
                      if (seat.isAvailable) {
                        onSelect(seat.seatId);
                      }
                    }}
                  >
                    {seat.seatLabel}
                  </div>
                );
              })}

            </div>
          )
        )}

      </div>
    </div>
  );
};

export default SeatsSelection;