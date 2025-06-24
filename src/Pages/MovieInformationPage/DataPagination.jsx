import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DataPagination.css";

const DatePagination = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate(); 
  const { movie_name } = useParams(); 

  const handleTimeClick = (time) => {
    const selectedDate = props.dateData[activeIndex].label;

    // Safely encode date and time for use in URL
    const encodedDate = encodeURIComponent(selectedDate);
    const encodedTime = encodeURIComponent(time);

    // Navigate to /tickets/:movie_name/:date/:time
    navigate(`/tickets/${movie_name}/${encodedDate}/${encodedTime}`);
  };

  return (
    <div className="date-pagination">
      <div className="date-nav">
        <button
          className="arrow"
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
        >
          &lt;
        </button>

        <ul className="date-list">
          {props.dateData.map((date, index) => (
            <li
              key={index}
              className={`date-item ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
             {date.label}
            </li>
          ))}
        </ul>

        <button
          className="arrow"
          onClick={() =>
            setActiveIndex((prev) =>
              Math.min(props.dateData.length - 1, prev + 1)
            )
          }
        >
          &gt;
        </button>
      </div>

      <ul className="time-list">
        {props.dateData[activeIndex].times.map((time, idx) => (
          <button key={idx} className="time-item" onClick={() => handleTimeClick(time)}>
            {time}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default DatePagination;
