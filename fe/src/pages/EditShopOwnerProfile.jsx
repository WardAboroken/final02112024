import React, { useState, useEffect, useCallback } from "react";
import "./css/shopOwnerEditProfile.css";
import user_profile from "../assets/images/user_profile.jpeg";
import { API_URL } from "../constans.js";
import axios from "axios";

// Constants for API endpoints to fetch city and street data
const api_url = "https://data.gov.il/api/3/action/datastore_search";
const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const streets_resource_id = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const city_name_key = "שם_ישוב";
const street_name_key = "שם_רחוב";

function EditShopOwnerProfile() {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    paypalEmail: "",
    phoneNumber: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    subscriptionType: "",
    businessName: "",
    businessAddress: "",
    description: "",
    merchantId: "",
    selectedCity: "",
    selectedStreet: "",
    profilePicturePath: "",
  });

  // State variables to manage input values for profile fields
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState(""); // PayPal email for shop owner
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [userInfo, setUserInfo] = useState({});

  // API Helper Functions
  const getData = useCallback((resource_id, q = "", limit = "100") => {
    return axios.get(api_url, {
      params: { resource_id, q, limit },
      responseType: "json",
    });
  }, []);

  const parseResponse = useCallback((records = [], field_name) => {
    return records.map((record) => record[field_name].trim()).filter(Boolean);
  }, []);

  const populateCities = useCallback(async () => {
    try {
      const citiesList = await getData(cities_resource_id);
      setCities(parseResponse(citiesList.data.result.records, city_name_key));
    } catch (error) {
      console.log("Error fetching cities:", error);
    }
  }, [getData, parseResponse]);

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

  useEffect(() => {
    const fetchShopOwnerInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch shop owner info");
        }
        const data = await response.json();

        setUserInfo(data.userInfo);
        setFormData({
          name: data.userInfo.name,
          userName: data.userInfo.userName,
          email: data.userInfo.email,
          paypalEmail: data.userInfo.paypalEmail,
          phoneNumber: data.userInfo.phoneNumber,
          businessName: data.userInfo.businessName,
          description: data.userInfo.description,
          merchantId: data.userInfo.merchantId,
          selectedCity: data.userInfo.city || "",
          selectedStreet: data.userInfo.street || "",
        });
        setImagePreview(
          `${API_URL}/uploads/${data.userInfo.profilePicturePath}`
        );
      } catch (error) {
        setError("Error fetching user info: " + error.message);
      }
    };

    fetchShopOwnerInfo();
    populateCities();
  }, [populateCities]);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file.");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle form submission for profile update
 const handleSubmit = async (event) => {
   event.preventDefault();
   setError("");
   setSuccess("");

   if (
     formData.newPassword &&
     formData.newPassword !== formData.confirmNewPassword
   ) {
     setError("New passwords do not match.");
     return;
   }

   const updatedFields = {
     userName: formData.userName, // Include userName
     password: formData.password, // Include password
   };

   // Add city and street if selected
   if (formData.selectedCity) {
     updatedFields.city = formData.selectedCity;
   }
   if (formData.selectedStreet) {
     updatedFields.street = formData.selectedStreet;
   }

   // Add other fields that have changed
   Object.keys(formData).forEach((key) => {
     if (
       formData[key] &&
       formData[key] !== userInfo[key] &&
       key !== "selectedCity" &&
       key !== "selectedStreet"
     ) {
       updatedFields[key] = formData[key];
     }
   });

   try {
     const formDataToSend = new FormData();
     Object.entries(updatedFields).forEach(([key, value]) => {
       formDataToSend.append(key, value);
     });

     if (image) {
       formDataToSend.append("profilePicture", image);
     }

     const response = await fetch("/updateProfile/updateShopOwnerProfile", {
       method: "POST",
       body: formDataToSend,
     });

     if (!response.ok) throw new Error("Profile update failed");

     window.alert("Profile updated successfully!");
   } catch (error) {
     window.alert("Error updating profile: " + error.message);
   }
 };


   


    
  return (
    <div className="editCustomerProfile-body">
      <main className="editCustomerProfile-container">
        <h2>Shop Owner Profile Edit</h2>
        <form onSubmit={handleSubmit}>
          {/* Image upload and preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="imagePreview"
            />
          )}
          <input type="file" onChange={handleImageChange} />
          <p>User name</p>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleInputChange}
            readOnly
          />
          <p>Name</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <p>Your email</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <p>Your PayPal email</p>
          <input
            type="email"
            name="paypalEmail"
            placeholder="PayPal email"
            value={formData.paypalEmail}
            onChange={handleInputChange}
          />
          <p>PayPal merchantId</p>
          <input
            type="text"
            name="merchantId"
            placeholder="MerchantId"
            value={formData.merchantId}
            onChange={handleInputChange}
          />
          <p>Phone number</p>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <p>Business name</p>
          <input
            type="text"
            name="businessName"
            placeholder="Business name"
            value={formData.businessName}
            onChange={handleInputChange}
          />
          <p>Description</p>
          <input
            type="text"
            name="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <p>Address</p>
          <input
            type="text"
            name="selectedCity"
            placeholder="City"
            value={formData.selectedCity}
            onChange={(e) => {
              handleInputChange(e);
              populateStreets(e.target.value);
            }}
          />
          <select
            name="selectedStreet"
            value={formData.selectedStreet}
            onChange={handleInputChange}
          >
            <option value="">Select Street</option>
            {streets.map((street, index) => (
              <option key={index} value={street}>
                {street}
              </option>
            ))}
          </select>
          <input
            type="password"
            name="password"
            placeholder="Current Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
          />

          {/* Submit button for profile update */}
          <button type="submit">Update Profile</button>
        </form>
      </main>
    </div>
  );
}

export default EditShopOwnerProfile;
