import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

function ResetPass() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State to store any feedback message

  // Handle the form submission for password reset
  const handleLoginClick = async (event) => {
    event.preventDefault();

    // Extract username, password, and confirmPassword from form data
    const formData = new FormData(event.target);
    const userName = formData.get("UserName");
    const psw = formData.get("psw");
    const confirmPsw = formData.get("confirmPassword");

    // Check if passwords match before sending to backend
    if (psw !== confirmPsw) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    // Only send username and new password to the backend
    const userData = { userName, psw };

    try {
      // Send reset password request to the backend
      const response = await fetch("/recoveryPsw/resetPsw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Parse the response JSON data
      const data = await response.json();
      console.log("Reset password response:", data); // Log response for debugging

      // Display appropriate messages based on success or failure
      if (response.ok) {
        window.alert(
          "You have successfully reset your password. You can now log in with your new password."
        );
        navigate("/Login"); // Redirect to login page after successful reset
      } else {
        window.alert("Failed to reset your password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error.message);
      window.alert("Failed to reset your password. Please try again.");
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleLoginClick}>
          {/* Username input field */}
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="Username"
            required
          />
          {/* New password input field */}
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
            required
          />
          {/* Confirm new password input field */}
          <input
            className="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
          {/* Submit button to reset password */}
          <button className="menuItem_login" type="submit">
            RESET
          </button>
        </form>
        {/* Display message if passwords do not match or other issues occur */}
        {message && <p>{message}</p>}
      </main>
    </div>
  );
}

export default ResetPass;
