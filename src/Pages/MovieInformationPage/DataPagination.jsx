import React, { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

import "./DataPagination.css";

const DatePagination = (props) => {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const navigate = useNavigate();
  const { slug } = useParams();

  const { member } = useAuth();

  const handleTimeClick = (showtime) => {
    const selectedDate =
      props.dateData[activeIndex].label;

    const encodedDate =
      encodeURIComponent(selectedDate);

    const encodedTime =
      encodeURIComponent(showtime.time);

    const bookingPath =
      `/tickets/${slug}/${showtime.id}/${encodedDate}/${encodedTime}`;

    // User is not signed in
    if (!member) {
      navigate("/sign-in", {
        state: {
          from: bookingPath,
        },
      });

      return;
    }

    // User is signed in
    navigate(bookingPath);
  };

  return (
    <div className="date-pagination">
      <div className="date-nav">
        <button
          className="arrow"
          onClick={() =>
            setActiveIndex((prev) =>
              Math.max(0, prev - 1)
            )
          }
        >
          &lt;
        </button>

        <ul className="date-list">
          {props.dateData.map(
            (date, index) => (
              <li
                key={index}
                className={`date-item ${
                  index === activeIndex
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveIndex(index)
                }
              >
                {date.label}
              </li>
            )
          )}
        </ul>

        <button
          className="arrow"
          onClick={() =>
            setActiveIndex((prev) =>
              Math.min(
                props.dateData.length - 1,
                prev + 1
              )
            )
          }
        >
          &gt;
        </button>
      </div>

      <ul className="time-list">
        {props.dateData[
          activeIndex
        ].times.map((showtime) => (
          <button
            key={showtime.id}
            className="time-item"
            onClick={() =>
              handleTimeClick(showtime)
            }
          >
            {showtime.time}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default DatePagination;