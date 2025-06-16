import React from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi"; // ✅ this line fixes the error
import "./Navbar.css";

function Navbar(props) {
  return (
    <div>
        <nav>

            <ul className="navbarcenter mobile-menu">
                <li>
                    <Link to="/">
                    <button>Home</button>
                    </Link> 
                </li>

                <li>
                    <Link to="/movies">
                    <button>Movies</button>
                    </Link>
                </li>
            
                <li>
                    <Link to="/contact">
                    <button>Contact</button>
                    </Link>
                </li>
            </ul>

        </nav>
    </div>
  );
}

export default Navbar;
