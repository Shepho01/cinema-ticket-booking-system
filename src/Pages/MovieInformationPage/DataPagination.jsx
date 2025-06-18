import React, { useState } from "react";
import "./DataPagination.css";

const DatePagination = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const dateData = [
    { label: "Today", times: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"] },
    { label: "Tomorrow", times: ["11:00 AM", "2:30 PM", "5:30 PM", "8:30 PM"] },
    { label: "19/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
    { label: "20/06", times: ["9:00 AM", "12:30 PM", "6:30 PM"] },
    { label: "21/06", times: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"] },
    { label: "22/06", times: ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM"] },
    { label: "23/06", times: ["10:00 AM", "2:00 PM", "6:00 PM"] },
    { label: "24/06", times: ["12:00 PM", "3:00 PM", "6:00 PM"] },
    { label: "25/06", times: ["1:00 PM", "4:00 PM", "7:00 PM"] },
    { label: "26/06", times: ["11:30 AM", "2:30 PM", "5:30 PM"] },
    { label: "27/06", times: ["9:30 AM", "12:30 PM", "3:30 PM", "6:30 PM"] },
  ];

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
          {dateData.map((date, index) => (
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
              Math.min(dateData.length - 1, prev + 1)
            )
          }
        >
          &gt;
        </button>
      </div>

      <ul className="time-list">
        {dateData[activeIndex].times.map((time, idx) => (
          <li key={idx} className="time-item">
            {time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatePagination;
