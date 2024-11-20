import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./css/login.css";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
        setMessage(data.message);
        navigate(data.redirectUrl); // Redirect on successful login
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error checking user:", error.message);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLoginClick}>
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="Username"
          />
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
          />
          <button className="menuItem_login" type="submit">
            Login
          </button>
          <NavLink to="/ForgotPassword" className="menuItem_forgotPassword" end>
            Forgot Password?
          </NavLink>
        </form>
        {message && <p>{message}</p>}
      </main>
    </div>
  );
}

export default Login;
