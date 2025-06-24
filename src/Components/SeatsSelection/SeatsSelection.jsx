import './SeatsSelection.css';

const SeatsSelection = (props) => {
  if (!props.seats || !Array.isArray(props.seats)) {
    return <p>Loading seat data...</p>;
  }

  return (
    <div>
      <h2 className='seats-selection-cinema-screen'>CINEMA SCREEN</h2>
      <div className="seats-grid">
        {props.seats.map((row, rowIndex) => (
          <div className="seats-row" key={rowIndex}>
            {row.map((seat, colIndex) => {
              let seatClass = seat === 1 ? 'available' :
                              seat === 2 ? 'selected' :
                              'unavailable';

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`seat ${seatClass}`}
                  onClick={() => seat !== 0 && props.onSelect(rowIndex, colIndex)}
                >
                  {String.fromCharCode(65 + rowIndex)}{colIndex + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatsSelection;
