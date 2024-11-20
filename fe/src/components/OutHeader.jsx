// OutHeader.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../pages/css/outHeader.css"; // Import CSS for styling the header

// OutHeader component for users who are not logged in
function OutHeader() {
  return (
    <header>
      {/* Main header wrapper */}
      <div className="header">
        <div className="header__wrap">
          {/* Logo section */}
          <div className="logo">
            {/* Link to the home page with a slogan as the logo */}
            <Link to="/">
              <span className="slogan">All4U</span>
            </Link>
          </div>

          {/* Navigation menu for login and signup */}
          <nav className="loginMenu">
            <ul className="menu">
              {/* Login Link */}
              <li>
                <NavLink
                  to="/Login"
                  className={
                    ({ isActive }) =>
                      isActive ? "menu-item active" : "menu-item" // Apply active class if link is active
                  }
                  end
                >
                  Login
                </NavLink>
              </li>

              {/* SignUp Link */}
              <li>
                <NavLink
                  to="/UserTypeSelection"
                  className={
                    ({ isActive }) =>
                      isActive ? "menu-item active" : "menu-item" // Apply active class if link is active
                  }
                >
                  SignUp
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default OutHeader;
