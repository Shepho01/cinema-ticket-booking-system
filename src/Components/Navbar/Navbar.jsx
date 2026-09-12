import React from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiUser } from "react-icons/fi";
import "./Navbar.css";
import homeIcon from "../../assets/home.png";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { member, authLoading } = useAuth();

  return (
    <div>
      <nav className="navbarcenter-mobile-menu">
        <div className="navbarcenter-items">

          <Link to="/">
            <img
              className="navbar-home-icon"
              src={homeIcon}
              alt="Home"
            />
          </Link>

          <Link to="/movies">
            <p className="navbar-links">
              MOVIES
            </p>
          </Link>

          {!authLoading && (
            <>
              {member ? (
                <Link
                  to="/profile"
                  className="navbar-profile-link"
                >
                  <FiUser className="navbar-profile-icon" />

                  <p className="navbar-links">
                    {member.firstName.toUpperCase()}
                  </p>
                </Link>
                
              ) : (
                <Link to="/sign-in">
                  <p className="navbar-links">
                    SIGN IN
                  </p>
                </Link>
              )}
            </>
          )}

        </div>
      </nav>
    </div>
  );
}

export default Navbar;