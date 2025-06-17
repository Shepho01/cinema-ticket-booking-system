import React from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi"; // ✅ this line fixes the error
import "./Navbar.css";
import homeIcon from "../../assets/home.png"; // Adjust the path as necessary

function Navbar(props) {
  return (
    <div>
        <nav className="navbarcenter-mobile-menu">

            <div className="navbarcenter-items">
                <Link to="/">
                    <img className="navbar-home-icon" src={homeIcon} alt="Home"/>
                </Link> 
            
                <Link to="/movies">
                    <p className="navbar-links"> MOVIES </p>
                </Link>

                <p className="navbar-links">SIGN IN</p>
            </div>
        </nav>
    </div>
  );
}

export default Navbar;
