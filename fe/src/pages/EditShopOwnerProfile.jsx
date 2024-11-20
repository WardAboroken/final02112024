import React, { useState, useEffect } from "react";
import "./css/shopOwnerEditProfile.css";
import user_profile from "../assets/images/user_profile.jpeg";

function EditShopOwnerProfile() {
  // State variables to manage input values for profile fields
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [paypalEmail, setPaypalEmail] = useState(""); // PayPal email for shop owner
  const [error, setError] = useState("");

  // State variables for image upload and preview
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user_profile);

  // State variable for storing the user's information from the backend
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    businessName: "",
    businessAddress: "",
    description: "",
    paypalEmail: "", // Initial state for PayPal email
  });

  // Fetch shop owner information on component mount
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

        // Initialize form fields with fetched data
        setName(data.userInfo.name);
        setUserName(data.userInfo.userName);
        setEmail(data.userInfo.email);
        setNumber(data.userInfo.phoneNumber);
        setBusinessName(data.userInfo.businessName);
        setBusinessAddress(data.userInfo.businessAddress);
        setDescription(data.userInfo.description);
        setPaypalEmail(data.userInfo.paypalEmail); // Initialize PayPal email
        setImagePreview(data.userInfo.profileImage || user_profile);
      } catch (error) {
        setError("Error fetching shop owner info: " + error.message);
      }
    };

    fetchShopOwnerInfo();
  }, []);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission for profile update
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    setError("");

    // Construct data for profile update
    const shopOwnerData = {
      name: name || userInfo.name,
      userName: userName || userInfo.userName,
      email: email || userInfo.email,
      phoneNumber: number || userInfo.phoneNumber,
      password,
      newPassword,
      businessName: businessName || userInfo.businessName,
      businessAddress: businessAddress || userInfo.businessAddress,
      description: description || userInfo.description,
      paypalEmail: paypalEmail || userInfo.paypalEmail, // Include PayPal email
      profileImage: image ? image.name : userInfo.profileImage,
    };

    // Send the profile data to the server
    try {
      const response = await fetch("/updateProfile/updateShopOwnerProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopOwnerData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        window.alert("YOUR UPDATE IS NOT SUCCESS");
        throw new Error(`Error: ${response.statusText}, ${errorData}`);
      }
      window.alert("YOUR UPDATE IS SUCCESS");
    } catch (error) {
      window.alert("YOUR UPDATE IS NOT SUCCESS");
    }
  };

  return (
    <div className="editCustomerProfile-body">
      <main className="editCustomerProfile-container">
        <h2>Shop Owner Profile Edit</h2>
        <form onSubmit={handleSubmit}>
          {/* Image upload and preview */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="User Profile"
              className="imagePreview"
            />
          )}

          {/* Input fields for updating profile information */}
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
            className="businessName"
            type="text"
            placeholder={userInfo.businessName}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            className="businessAddress"
            type="text"
            placeholder={userInfo.businessAddress}
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
          <textarea
            placeholder={userInfo.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}

          {/* Submit button for profile update */}
          <button type="submit">Update Profile</button>
        </form>
      </main>
    </div>
  );
}

export default EditShopOwnerProfile;
