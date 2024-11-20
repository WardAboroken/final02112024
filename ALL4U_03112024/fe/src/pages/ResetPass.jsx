import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";


function ResetPass() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  

  const handleLoginClick = async (event) => {
    event.preventDefault();

    // Extract username and password from form data
    // Extract username, password, and confirmPassword from form data
    const formData = new FormData(event.target);
    const userName = formData.get("UserName");
    const psw = formData.get("psw");
    const confirmPsw = formData.get("confirmPassword");

    // Check if passwords match
    if (psw !== confirmPsw) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    // Send only username and password to backend
    const userData = { userName, psw };

    try {
      // Send login request to backend
      const response = await fetch("/recoveryPsw/resetPsw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Parse response JSON data
      const data = await response.json();
      console.log("Login response:", data); // Log response for debugging

      // Handle response based on server's success or failure
      if (response.ok) {
         window.alert(
           "you success to reset your password , you can to login with your new password now"
         );
        navigate("/Login"); // Redirect to the specified URL after successful login
      } else {
        window.alert("you failed to reset your password , please try again");
      }
    } catch (error) {
      console.error("Error checking user:", error.message);
      window.alert("you failed to reset your password , please try again");
    }
  };

  return (
    <div div className="login-body">
      <main className="login-container">
        <h2>Reset Password</h2>
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
          <input
            className="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <button className="menuItem_login" type="submit">
            RESET
          </button>
        </form>
        {message && <p>{message}</p>}
      </main>
    </div>
  );
}

export default ResetPass;
