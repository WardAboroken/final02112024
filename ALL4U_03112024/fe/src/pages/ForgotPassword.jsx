import React, { useState } from "react";
import axios from "axios";
import "./css/login.css";
import "./css/forgotPassword.css";

import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePhoneChange = (e) => setPhoneNumber(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/recoveryPsw/recoveryPsw", {
        email,
        userName,
        phoneNumber,
      });
      
      if (response.status === 200) {
        window.alert("you success to reset your password but you need to do that from your mail in gmail");
        // setMessage("you success to reset your password but you need to do that from your mail in gmail");
        navigate("/Login"); // Redirect to the success page
      }
    } catch (error) {
      window.alert("An error occurred. Please try again.");
      // setMessage("An error occurred. Please try again.");
      console.error("Error sending recovery email:", error);
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Password Recovery</h2>
        <h3>
          To restore your password you need to verify your personal details:
        </h3>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={userName}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Send Recovery Email
          </button>
        </form>
        {/* {message && <p className="message">{message}</p>} */}
      </main>
    </div>
  );
}

export default ForgotPassword;
