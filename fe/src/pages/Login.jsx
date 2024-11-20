import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./css/login.css";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State to store login status message

  // Handle the login form submission
  const handleLoginClick = async (event) => {
    event.preventDefault();

    // Extract username and password from form data
    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("UserName"),
      psw: formData.get("psw"),
    };

    try {
      // Send login request to backend
      const response = await fetch("/login/loginController", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Login response:", data); // Log response for debugging

      if (response.ok) {
        setMessage(data.message); // Set success message
        navigate(data.redirectUrl); // Redirect to URL provided by backend on success
      } else {
        setMessage(data.message); // Display error message from backend
      }
    } catch (error) {
      console.error("Error checking user:", error.message);
      setMessage("Invalid username or password"); // Show a generic error message
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLoginClick}>
          {/* Username input field */}
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="Username"
            required
          />
          {/* Password input field */}
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
            required
          />
          {/* Login button */}
          <button className="menuItem_login" type="submit">
            Login
          </button>
          {/* Link to Forgot Password page */}
          <NavLink to="/ForgotPassword" className="menuItem_forgotPassword">
            Forgot Password?
          </NavLink>
        </form>
        {/* Display login message */}
        {message && <p>{message}</p>}
      </main>
    </div>
  );
}

export default Login;
