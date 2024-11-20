// ShopOwnerHeader.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import user_profile from "../assets/images/user_profile.jpeg"; // Ensure the path is correct
import "../pages/css/shopOwnerHeader.css"; // CSS styling for the header component

// Main component for the Shop Owner's Header
const ShopOwnerHeader = () => {
  // State to control profile dropdown visibility and store user information
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    image: "", // Profile image field
  });

  // useEffect hook to fetch user information when the component mounts
  useEffect(() => {
    fetchUserInfo(); // Calls the function to get user information on mount
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

      // Update userInfo state with data if the request is successful
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.userInfo); // Sets user information into state
      } else {
        console.error("Failed to fetch user info"); // Logs error if response is not ok
      }
    } catch (error) {
      console.error("Error fetching user info:", error); // Catches and logs any errors
    }
  };

  // Function to toggle the profile dropdown visibility
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown); // Toggle dropdown open/close state
  };

  return (
    <header className="shop-owner-header">
      {/* Left Section: Logo or Shop Name */}
      <div className="header-left">
        <NavLink to="/ShopOwnerMainPage" className="shop-logo">
          All4U
        </NavLink>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="header-center">
        <nav className="nav-links">
          {/* Orders Link */}
          <NavLink
            to="/ShopOwnerOrdersPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Orders
          </NavLink>
          {/* Products Link */}
          <NavLink
            to="/ShopOwnerProductsPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Products
          </NavLink>
          {/* Shop Link */}
          <NavLink
            to="/ShopOwnerMainPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Shop
          </NavLink>
        </nav>
      </div>

      {/* Right Section: User Profile Icon */}
      <div className="header-right">
        <div className="profileInfo">
          {/* Profile button to toggle profile dropdown */}
          <button className="menuItem" onClick={toggleProfileDropdown}>
            <img src={userInfo.image || user_profile} alt="User Profile" />
          </button>

          {/* Profile Dropdown */}
          <div
            className={`profileDropdownContent ${
              showProfileDropdown ? "show" : ""
            }`}
          >
            {/* User Info Table */}
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
            {/* Edit Profile Button */}
            <NavLink to="/EditShopOwnerProfile" className="editProfileBtn">
              Edit Profile
            </NavLink>
            {/* LogOut Button */}
            <NavLink to="/" className="logoutBtn">
              LogOut
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopOwnerHeader;
