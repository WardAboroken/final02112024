import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import "./css/customerSignup.css";

// API details for fetching cities and streets
const api_url = "https://data.gov.il/api/3/action/datastore_search";
const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const streets_resource_id = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const city_name_key = "שם_ישוב";
const street_name_key = "שם_רחוב";

function CustomerSignUp() {
  // State variables for selected categories, city, street, and fetched data
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const navigate = useNavigate();

  // Define category options for user to choose
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

  // Reusable function to fetch data from an API resource
  const getData = useCallback((resource_id, q = "", limit = "100") => {
    return axios.get(api_url, {
      params: { resource_id, q, limit },
      responseType: "json",
    });
  }, []);

  // Helper function to parse response data based on field name
  const parseResponse = useCallback((records = [], field_name) => {
    return records.map((record) => record[field_name].trim()).filter(Boolean);
  }, []);

  // Fetches and parses a data list from the API
  const populateDataList = useCallback(
    (resource_id, field_name, query = {}) => {
      return getData(resource_id, query, 32000)
        .then((response) =>
          parseResponse(response?.data?.result?.records, field_name)
        )
        .catch((error) => {
          console.log("Error fetching data:", error);
          return [];
        });
    },
    [getData, parseResponse]
  );

  // Fetch cities list and update the cities state
  const populateCities = useCallback(async () => {
    try {
      const citiesList = await populateDataList(
        cities_resource_id,
        city_name_key
      );
      setCities(citiesList);
    } catch (error) {
      console.log("Error populating cities:", error);
    }
  }, [populateDataList]);

  // Fetch streets based on the selected city and update the streets state
  const populateStreets = useCallback(
    async (city) => {
      try {
        const streetsList = await populateDataList(
          streets_resource_id,
          street_name_key,
          JSON.stringify({ [city_name_key]: city })
        );
        setStreets(streetsList);
      } catch (error) {
        console.log("Error populating streets:", error);
      }
    },
    [populateDataList]
  );

  // Fetch cities data when component mounts
  useEffect(() => {
    populateCities();
  }, [populateCities]);

  // Handle changes in category selection
  const handleCategoryChange = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelectedCategories);
  };

  // Handle form submission for sign-up
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("UserName"),
      password: formData.get("psw"),
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      selectedCategories: selectedCategories,
      address: `City: ${selectedCity}, Street: ${selectedStreet}`,
    };

    // Validate that passwords match
    if (userData.password !== userData.confirmPassword) {
      window.alert("Passwords do not match. Please try again.");
      return;
    }

    // Send user data to the server
    try {
      const response = await fetch("/addNewUser/add-user-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/ShopMainPage");
        window.alert("User added successfully!");
      } else {
        if (data.message === "User already exist.") {
          window.alert(
            "This username or email is already registered. Please use a different one."
          );
          window.location.reload();
        } else {
          window.alert("Failed to sign up. Please try again.");
          window.location.reload();
        }
      }
    } catch (error) {
      window.alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Customer Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields for user data */}
          <input className="name" type="text" name="name" placeholder="Name" />
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="User Name"
            required
          />
          <input
            className="email"
            type="text"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            required
          />
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
            required
          />
          <input
            className="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />

          {/* City selection */}
          <div className="form-field" id="city-selection">
            <label htmlFor="city-choice">Select City:</label>
            <input
              list="cities"
              name="selectedCity"
              id="city-choice"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedStreet(""); // Reset streets when city changes
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

          {/* Street selection */}
          <div className="form-field" id="street-selection">
            <select
              id="street-choice"
              name="selectedStreet"
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              required
            >
              <option value="">Choose Street</option>
              {streets.length === 0 && (
                <option disabled>
                  No streets available for the selected city
                </option>
              )}
              {streets.map((street, index) => (
                <option key={index} value={street}>
                  {street}
                </option>
              ))}
            </select>
          </div>

          {/* Category selection checkboxes */}
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

          <button type="submit">Sign Up</button>
        </form>
      </main>
    </div>
  );
}

export default CustomerSignUp;
