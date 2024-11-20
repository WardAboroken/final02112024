// UserTypeSelection.jsx
import "./css/userTypeSelection.css";
import "./css/login.css"
import React from "react";
import { NavLink } from "react-router-dom";


function UserTypeSelection() {
  return (
    <div div className="login-body">
      <main className="typeContainer">
        <h2>Choose your user type</h2>
        <div className="button-container">
          <NavLink to="/ShopOwnerSignUp" className="nav-link">
            Shop Owner
          </NavLink>
          <NavLink to="/CustomerSignUp" className="nav-link">
            Customer
          </NavLink>
        </div>
      </main>
    </div>
  );
}

export default UserTypeSelection;
