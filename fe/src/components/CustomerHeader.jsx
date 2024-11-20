// CustomerHeader.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import basket_cart from "../assets/images/shopping-cart.png";
import "../pages/css/customerHeader.css"; // CSS styling for the header component
import { API_URL } from "../constans.js"; // API base URL

const CustomerHeader = () => {
  // State to control visibility of category and profile dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // State to store user information
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    profilePicturePath: "", // Path for profile picture
  });

  // State for search term input
  const [searchTerm, setSearchTerm] = useState("");

  // Hook for navigation
  const navigate = useNavigate();

  // Categories available in the dropdown
  const categories = {
    Toys: 1,
    Clothing: 2,
    "Work Tools": 3,
    "Pet Supplies": 4,
    "Home Styling": 5,
    Cleaning: 6,
    Shoes: 7,
    Sport: 8,
    Accessories: 9,
    Furnishing: 10,
    Safety: 11,
    Beauty: 12,
  };

  // useEffect hook to fetch user info when the component mounts
  useEffect(() => {
    fetchUserInfo();
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
        setUserInfo(data.userInfo);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Function to handle search action
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to ShopMainPage with search term as a query parameter
      navigate(`/ShopMainPage?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value); // Update search term state with user input
  };

  // Function to handle "Enter" key press on search input
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  // Function to toggle category dropdown visibility
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown); // Toggle visibility
    setShowProfileDropdown(false); // Hide profile dropdown if it was open
  };

  // Function to toggle profile dropdown visibility
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown); // Toggle visibility
    setShowCategoryDropdown(false); // Hide category dropdown if it was open
  };

  // Destructure userInfo properties for easier access in JSX
  const { name, userName, email, phoneNumber, profilePicturePath } = userInfo;

  return (
    <header className="header">
      {/* Left section: category dropdown and search bar */}
      <div className="left-section">
        {/* Category Dropdown Menu */}
        <div className="menu">
          <button className="toggleButton" onClick={toggleCategoryDropdown}>
            Categories
          </button>
          <div
            className={`dropdownContent ${showCategoryDropdown ? "show" : ""}`}
          >
            {/* List of categories as links */}
            {Object.keys(categories).map((category) => (
              <NavLink
                key={categories[category]}
                to={`/ShopMainPage/${category.replace(/\s+/g, "")}`}
                className="menuItem"
                onClick={() => setShowCategoryDropdown(false)} // Close dropdown on selection
              >
                {category}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="searchBox">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress} // Trigger search on Enter key
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Center section: logo or main page button */}
      <div className="center-section">
        <NavLink to="/ShopMainPage" className="shopMainPage-button">
          All4U
        </NavLink>
      </div>

      {/* Right section: profile and cart icons */}
      <div className="right-section">
        <div className="profileInfo">
          {/* Profile button to toggle profile dropdown */}
          <button className="menuItem" onClick={toggleProfileDropdown}>
            <img
              src={`${API_URL}/uploads/${profilePicturePath}`}
              alt={userName}
              width="50"
            />
          </button>
          {/* Profile Dropdown Content */}
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
                  <td>{name}</td>
                </tr>
                <tr>
                  <th>User Name</th>
                  <td>{userName}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{email}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{phoneNumber}</td>
                </tr>
              </tbody>
            </table>
            {/* Profile Options */}
            <NavLink to="/EditCustomerProfile" className="editProfileBtn">
              Edit Profile
            </NavLink>
            <NavLink to="/CustomerOrdersHistory" className="ordersHistoryBtn">
              Orders History
            </NavLink>
            <NavLink to="/" className="logoutBtn">
              LogOut
            </NavLink>
          </div>
        </div>

        {/* Cart Icon Button */}
        <div className="basketCart">
          <NavLink to="/BasketCart" className="menuItem">
            <img src={basket_cart} alt="Basket" />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
