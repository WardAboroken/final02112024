// Import necessary libraries and components
import React from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering the root component
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for client-side routing
import App from "./App"; // Import the main App component

// Create a root element to render the app inside the HTML element with id "root"
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application to the DOM
root.render(
  <React.StrictMode>
    {" "}
    {/* Enables additional checks and warnings in development mode */}
    <BrowserRouter>
      {" "}
      {/* Wraps App component to enable routing across the application */}
      <App /> {/* Main component containing the application logic and routes */}
    </BrowserRouter>
  </React.StrictMode>
);
