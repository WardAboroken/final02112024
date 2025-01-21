// UserTypeSelection.jsx

// Import necessary CSS files for styling
import "./css/userTypeSelection.css";
import "./css/login.css";

// Import React and NavLink from react-router-dom for navigation
import React from "react";
import { NavLink } from "react-router-dom";

// Functional component for selecting user type
function UserTypeSelection() {
  return (
    <div className="login-body">
      <main className="typeContainer">
        <h2>Choose your user type</h2> {/* Heading for user type selection */}
        {/* Container for navigation buttons */}
        <div className="button-container">
          {/* Navigation link to Shop Owner Sign Up page */}
          <NavLink to="/ShopOwnerSignUp" className="nav-link">
            <p className="nav-link-p"> Shop Owner</p>
          </NavLink>

          {/* Navigation link to Customer Sign Up page */}
          <NavLink to="/CustomerSignUp" className="nav-link">
            <p className="nav-link-p">Customer</p>
          </NavLink>
        </div>
      </main>
    </div>
  );
}

// Export component as default
export default UserTypeSelection;
