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

  if (authLoading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">
          Loading profile...
        </p>
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
      <div className="profile-card">

        <div className="profile-icon">
          <FiUser />
        </div>

        <h1>MY PROFILE</h1>

        <p className="profile-welcome">
          Welcome back, {member.firstName}
        </p>

        <div className="profile-details">
          <div className="profile-detail">
            <span>First Name</span>
            <strong>{member.firstName}</strong>
          </div>

          <div className="profile-detail">
            <span>Last Name</span>
            <strong>{member.lastName}</strong>
          </div>

          <div className="profile-detail">
            <span>Email</span>
            <strong>{member.email}</strong>
          </div>
        </div>

        <button
          className="profile-logout-button"
          onClick={handleLogout}
        >
          <FiLogOut />
          SIGN OUT
        </button>

      </div>
    </div>
  );
}

export default ProfilePage;