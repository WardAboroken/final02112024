import React, { useState } from "react";
import axios from "axios";
import "./css/login.css";
import "./css/forgotPassword.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  // State variables to hold input values
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  // Handlers for updating input states
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send recovery data to the server
      const response = await axios.post("/recoveryPsw/recoveryPsw", {
        email,
        userName,
        phoneNumber,
      });

      // Check if the recovery request was successful
      if (response.status === 200) {
        window.alert(
          "You have successfully requested a password reset. Please check your Gmail for further instructions."
        );
        navigate("/Login"); // Redirect to the login page
      }
    } catch (error) {
      window.alert("An error occurred. Please try again.");
      console.error("Error sending recovery email:", error);
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Password Recovery</h2>
        <h3>To restore your password, please verify your personal details:</h3>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          {/* Email input field */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          {/* Username input field */}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={userName}
              onChange={handleUsernameChange}
              required
            />
          </div>

          {/* Phone Number input field */}
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="submit-button">
            Send Recovery Email
          </button>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
