import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

// API configuration for fetching city and street data from government API
const api_url = "https://data.gov.il/api/3/action/datastore_search";
const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const streets_resource_id = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const city_name_key = "שם_ישוב";
const street_name_key = "שם_רחוב";

function ShopOwnerSignUp() {
  // State variables to store user input for the form fields
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetches data from the API based on resource ID and query parameters
  const getData = useCallback((resource_id, q = "", limit = "100") => {
    return axios.get(api_url, {
      params: { resource_id, q, limit },
      responseType: "json",
    });
  }, []);

  // Parses the API response to extract the desired field from each record
  const parseResponse = useCallback((records = [], field_name) => {
    return records.map((record) => record[field_name].trim()).filter(Boolean);
  }, []);

  // Fetches data list based on the resource ID and field name and returns it as an array
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

  // Populates cities list when the component mounts
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

  // Populates streets list based on the selected city
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

  // Calls populateCities to load cities when the component mounts
  useEffect(() => {
    populateCities();
  }, [populateCities]);

  // Handles form submission to send user data to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    if (
      !name ||
      !userName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !subscriptionType ||
      !businessName ||
      !selectedCity ||
      !selectedStreet ||
      !description ||
      !merchantId
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Form data to be sent to the backend
      const formData = {
        name,
        userName,
        email,
        paypalEmail,
        phoneNumber,
        password,
        subscriptionType,
        businessName,
        businessAddress: `city: ${selectedCity} / street: ${selectedStreet}`,
        typeOfUser: "businessowner",
        description,
        merchantId,
      };

      // Log formData to verify it's correct
      console.log("Form data being sent:", formData);

      // Send POST request to backend endpoint
      const response = await fetch("/addNewUser/addUserShopOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse the response data
      const data = await response.json();

      // Check if response is successful
      if (response.ok) {
        // Navigate to another page upon successful submission
        navigate("/Login");

        // Show an alert box for success (you can customize this as needed)
        window.alert(
          "User added successfully! You need to wait for admin approval."
        );
      } else {
        // Handle specific error message
        if (data.message === "User already exist.") {
          window.alert(
            "This username or email is already registered. Please use a different one."
          );
        } else {
          window.alert("Failed to sign up. Please try again.");
        }
      }
    } catch (error) {
      // Handle general errors
      console.error("Error during signup:", error);
      window.alert("Failed to sign up. Please try again.");
    }
  };
  return (
    <div className="login-body">
      <main className="login-container">
        <h2>Shop Owner Sign Up</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)} // update the correct state
            required
          />

          <input
            type="text"
            placeholder="PayPal Merchant ID"
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)} // update the correct state
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
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
          <div className="form-field" id="street-selection">
            {/* <label htmlFor="street-choice">Select Street:</label> */}
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
          {/* Subscription Type Select */}
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            required
          >
            <option value="">Choose Subscription Type</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <button type="submit">Continue</button>
        </form>
      </main>
    </div>
  );
}

export default ShopOwnerSignUp;
