// AdminHeader.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import user_profile from "../assets/images/user_profile.jpeg"; // Default user profile image
import "../pages/css/insideHeader.css"; // CSS styling for the header component

const AdminHeader = () => {
  // State to control the visibility of the category and profile dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // State to store user information, including name, username, email, phone number, and profile image
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    image: "", // Added image field for user's profile picture
  });

  // useEffect hook to fetch user information when the component mounts
  useEffect(() => {
    fetchUserInfo(); // Fetch user information when component loads
  }, []);

  // Function to fetch user information from the server
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the request is successful, update userInfo state with fetched data
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.userInfo); // Set the user info with data received from the server
      } else {
        console.error("Failed to fetch user info"); // Log error if response is not ok
      }
    } catch (error) {
      console.error("Error fetching user info:", error); // Log any error during fetch
    }
  };

  // Function to toggle the visibility of the profile dropdown
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown); // Toggle profile dropdown visibility
    setShowCategoryDropdown(false); // Hide category dropdown if it was open
  };

  return (
    <header className="header">
      {/* Left section for potential menu items or navigation */}
      <div className="left-section">
        <div className="menu"></div>
      </div>

      {/* Right section containing profile information and dropdown */}
      <div className="right-section">
        <div className="profileInfo">
          {/* Button to toggle profile dropdown; shows user profile image */}
          <button className="menuItem" onClick={toggleProfileDropdown}>
            <img src={userInfo.image || user_profile} alt="User Profile" />
          </button>

          {/* Profile dropdown displaying user information */}
          <div
            className={`profileDropdownContent ${
              showProfileDropdown ? "show" : ""
            }`}
          >
            {/* User information table */}
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{userInfo.name}</td>
                </tr>
                <tr>
                  <th>User Name</th>
                  <td>{userInfo.userName}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{userInfo.phoneNumber}</td>
                </tr>
              </tbody>
            </table>

            {/* Logout button that links to the home page */}
            <NavLink to="/" className="logoutBtn">
              LogOut
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
