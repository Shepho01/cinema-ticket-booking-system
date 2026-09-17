import {
  useState,
  useEffect,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import OrderCard from "../../Components/OrderCard/OrderCard.jsx";
import WatchlistCard from "../../Components/WatchlistCard/WatchlistCard.jsx";

import "./ProfilePage.css";


function ProfilePage() {

  const {
    member,
    authLoading,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [
    activeTab,
    setActiveTab,
  ] = useState("orders");

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    bookingsLoading,
    setBookingsLoading,
  ] = useState(false);

  const [
    bookingsError,
    setBookingsError,
  ] = useState("");

  // =========================================================
  // Watchlist State
  // =========================================================

  const [watchlist, setWatchlist] = useState([]);

  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [watchlistError, setWatchlistError] = useState("");

  

  // =========================================================
  // FETCH MEMBER BOOKINGS
  // =========================================================

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        setBookingsLoading(true);
        setBookingsError("");

        const response = await fetch(
          `http://localhost:5000/bookings/member/${member.id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch bookings"
          );
        }

        setBookings(
          data.bookings || []
        );

      } catch (err) {

        console.error(
          "Failed to fetch bookings:",
          err
        );

        setBookingsError(
          err.message
        );

      } finally {

        setBookingsLoading(false);

      }

    };


    // Only fetch bookings when:
    //
    // 1. member exists
    // 2. user opens ORDERS
    if (
      member &&
      activeTab === "orders"
    ) {
      fetchBookings();
    }

  }, [member, activeTab]);



  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setWatchlistLoading(true);
        setWatchlistError("");

        const response = await fetch(
          "http://localhost:5000/watchlist",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to fetch watchlist"
          );
        }

        setWatchlist(
          data.watchlist || []
        );

      } catch (err) {
        console.error(
          "Failed to fetch watchlist:",
          err
        );

        setWatchlistError(
          err.message
        );

      } finally {
        setWatchlistLoading(false);
      }
    };

    if (
      member &&
      activeTab === "watchlist"
    ) {
      fetchWatchlist();
    }

  }, [member, activeTab]);


  // =========================================================
  // AUTH LOADING
  // =========================================================

  if (authLoading) {
    return (
      <div className="profile-page">
        <p>
          Loading profile...
        </p>
      </div>
    );
  }


  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!member) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {

    try {

      await logout();

      navigate("/");

    } catch (err) {

      console.error(
        "Logout failed:",
        err
      );

    }

  };

  const handleWatchlistRemove = (movieId) => {
    setWatchlist((currentWatchlist) =>
      currentWatchlist.filter(
        (movie) =>
          movie.movieId !== movieId
      )
    );
  };


  return (
    <div className="profile-page">

      <div className="profile-container">


        {/* PROFILE HEADER */}

        <div className="profile-header">

          <div className="profile-icon">
            <FiUser />
          </div>


          <div>

            <h1>
              {member.firstName}{" "}
              {member.lastName}
            </h1>

            <p>
              {member.email}
            </p>

          </div>


          <button
            className="profile-logout-button"
            onClick={handleLogout}
          >
            <FiLogOut />

            SIGN OUT
          </button>

        </div>



        {/* TABS */}

        <div className="profile-tabs">

          <button
            className={
              activeTab === "orders"
                ? "profile-tab active"
                : "profile-tab"
            }
            onClick={() =>
              setActiveTab("orders")
            }
          >
            ORDERS
          </button>


          <button
            className={
              activeTab === "watchlist"
                ? "profile-tab active"
                : "profile-tab"
            }
            onClick={() =>
              setActiveTab("watchlist")
            }
          >
            WATCHLIST
          </button>

        </div>



        {/* TAB CONTENT */}

        <div className="profile-tab-content">


          {/* ORDERS */}

          {activeTab === "orders" && (

            <div className="orders-section">

              {bookingsLoading && (
                <p>
                  Loading bookings...
                </p>
              )}


              {bookingsError && (
                <p className="orders-error">
                  {bookingsError}
                </p>
              )}


              {!bookingsLoading &&
                !bookingsError &&
                bookings.length === 0 && (

                  <p>
                    You haven't made any
                    bookings yet.
                  </p>

              )}

              {activeTab === "orders" && (
                <div className="orders-section">

                  <h2>MY ORDERS</h2>

                  {bookingsLoading && (
                    <p>Loading bookings...</p>
                  )}

                  {bookingsError && (
                    <p className="orders-error">
                      {bookingsError}
                    </p>
                  )}

                  {!bookingsLoading &&
                    !bookingsError &&
                    bookings.length === 0 && (
                      <div className="orders-empty">
                        <h3>No bookings yet</h3>

                        <p>
                          Your confirmed cinema bookings
                          will appear here.
                        </p>
                      </div>
                    )}

                  {!bookingsLoading &&
                    !bookingsError &&
                    bookings.map((booking) => (
                      <OrderCard
                        key={booking.bookingId}
                        booking={booking}
                      />
                    ))}

                </div>
              )}


            </div>

          )}



          {/* WATCHLIST */}

          {activeTab === "watchlist" && (
            <div className="watchlist-section">

              <h2>MY WATCHLIST</h2>

              {watchlistLoading && (
                <p>Loading watchlist...</p>
              )}

              {watchlistError && (
                <p className="watchlist-error">
                  {watchlistError}
                </p>
              )}

              {!watchlistLoading &&
                !watchlistError &&
                watchlist.length === 0 && (
                  <p>
                    You haven't added any movies to
                    your watchlist yet.
                  </p>
                )}

              {!watchlistLoading &&
                !watchlistError &&
                watchlist.map((movie) => (
                  <WatchlistCard
                    key={movie.watchlistId}
                    movie={movie}
                    onRemove={handleWatchlistRemove}
                  />
                ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}


export default ProfilePage;