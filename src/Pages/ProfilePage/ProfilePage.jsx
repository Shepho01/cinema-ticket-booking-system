import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";

function ProfilePage() {
  const {
    member,
    authLoading,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("watchlist");

  if (authLoading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
              {member.firstName} {member.lastName}
            </h1>

            <p>{member.email}</p>

            
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
              activeTab === "watchlist"
                ? "profile-tab active"
                : "profile-tab"
            }
            onClick={() => setActiveTab("watchlist")}
          >
            WATCHLIST
          </button>

          <button
            className={
              activeTab === "orders"
                ? "profile-tab active"
                : "profile-tab"
            }
            onClick={() => setActiveTab("orders")}
          >
            ORDERS
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="profile-tab-content">

          {activeTab === "watchlist" && (
            <div className="watchlist-section">
              <h2>MY WATCHLIST</h2>

              <p>
                You haven't added any movies to your
                watchlist yet.
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>MY ORDERS</h2>

              <p>
                You haven't made any bookings yet.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ProfilePage;