import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from "../constans.js";
import axios from "axios";
import "./css/editProfile.css";
import "./css/customerSignup.css";

// Constants for API endpoints to fetch city and street data
const api_url = "https://data.gov.il/api/3/action/datastore_search";
const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const streets_resource_id = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const city_name_key = "שם_ישוב";
const street_name_key = "שם_רחוב";

function EditProfile() {
  /* #region State Variables */
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for handling image uploads and previews
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // State for managing selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State for storing user info, including address and preferred categories
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    profilePicturePath: "",
  });

  // State for managing address selections
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  /* #endregion */

  /* #region Constants */
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
  /* #endregion */

  /* #region Handlers */
  // Toggle category selection for the user
  const handleCategoryChange = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelectedCategories);
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file.");
    }
  };
  /* #endregion */

  /* #region API Calls */
  // Generic function to fetch data from a specified resource
  const getData = useCallback((resource_id, q = "", limit = "100") => {
    return axios.get(api_url, {
      params: { resource_id, q, limit },
      responseType: "json",
    });
  }, []);

  // Parse data from response based on a specific field name
  const parseResponse = useCallback((records = [], field_name) => {
    return records.map((record) => record[field_name].trim()).filter(Boolean);
  }, []);

  // Fetch and populate cities for the dropdown
  const populateCities = useCallback(async () => {
    try {
      const citiesList = await getData(cities_resource_id);
      setCities(parseResponse(citiesList.data.result.records, city_name_key));
    } catch (error) {
      console.log("Error fetching cities:", error);
    }
  }, [getData, parseResponse]);

  // Fetch and populate streets based on selected city
  const populateStreets = useCallback(
    async (city) => {
      try {
        const streetsList = await getData(
          streets_resource_id,
          JSON.stringify({ [city_name_key]: city })
        );
        setStreets(
          parseResponse(streetsList.data.result.records, street_name_key)
        );
      } catch (error) {
        console.log("Error fetching streets:", error);
      }
    },
    [getData, parseResponse]
  );

  // Fetch user information and populate fields on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        const categories = Array.isArray(data.userInfo.preferredCategories)
          ? data.userInfo.preferredCategories
          : JSON.parse(data.userInfo.preferredCategories || "[]");

        setUserInfo(data.userInfo);
        setName(data.userInfo.name);
        setUserName(data.userInfo.userName);
        setEmail(data.userInfo.email);
        setNumber(data.userInfo.phoneNumber);
        setImagePreview(
          `${API_URL}/uploads/${data.userInfo.profilePicturePath}`
        );
        setSelectedCategories(categories);
        setSelectedCity(data.userInfo.city || "");
        setSelectedStreet(data.userInfo.street || "");
      } catch (error) {
        setError("Error fetching user info: " + error.message);
      }
    };

    fetchUserInfo();
    populateCities();
  }, [populateCities]);
  /* #endregion */

  /* #region Form Submission */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      window.alert("New passwords do not match. Please try again.");
      return;
    }

    // Create user data object for profile update
    const userData = {
      name: name || userInfo.name,
      userName: userName || userInfo.userName,
      email: email || userInfo.email,
      phoneNumber: number || userInfo.phoneNumber,
      password,
      newPassword,
      profilePicturePath: image || userInfo.profilePicturePath,
      preferredCategories: selectedCategories,
      address: `City: ${selectedCity}, Street: ${selectedStreet}`,
    };

    // Send the updated data to the server
    try {
      const response = await fetch("/updateProfile/updateCustomerProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        window.alert(`Update unsuccessful: ${errorData}`);
        return;
      }
      window.alert("Update Profile successful.");
      // Optionally reset or refetch user info here
    } catch (error) {
      window.alert("Update Profile unsuccessful. Please Try Again");
    }
  };
  /* #endregion */

  return (
    <div className="editCustomerProfile-body">
      <main className="editCustomerProfile-container">
        <h2>Customer Profile Edit</h2>
        <form onSubmit={handleSubmit}>
          {/* Display profile image preview if available */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="User Profile"
              className="imagePreview"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Input fields for user information */}
          <input
            className="name"
            type="text"
            placeholder={userInfo.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="UserName"
            type="text"
            placeholder={userInfo.userName}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            className="email"
            type="email"
            placeholder={userInfo.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="phoneNumber"
            type="tel"
            placeholder={userInfo.phoneNumber}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <input
            className="psw"
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="confirmPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* City Selection */}
          <div className="form-field">
            <label>Select City:</label>
            <input
              name="selectedCity"
              list="cities"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedStreet("");
                populateStreets(e.target.value);
              }}
              required
            />
            <datalist id="cities">
              {cities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
          </div>

          {/* Street Selection */}
          <div className="form-field" id="street-selection">
            <label>Select Street:</label>
            <select
              id="street-choice"
              name="selectedStreet"
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              required
            >
              <option value="">Choose Street</option>
              {streets.map((street, index) => (
                <option key={index} value={street}>
                  {street}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="category-list">
            <h3>Select Your Favorite Categories:</h3>
            {Object.entries(categories).map(([categoryName, categoryId]) => (
              <label key={categoryId}>
                <input
                  type="checkbox"
                  value={categoryId}
                  checked={selectedCategories.includes(categoryId)}
                  onChange={() => handleCategoryChange(categoryId)}
                />
                {categoryName}
              </label>
            ))}
          </div>

          <button type="submit">Update Profile</button>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;
