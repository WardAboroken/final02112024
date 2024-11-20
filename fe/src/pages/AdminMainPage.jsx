import React, { useEffect, useState } from "react";
import "./css/index.css";
import "./css/adminMainPage.css";

function AdminMainPage() {
  const [data, setData] = useState([]); // State to hold all user data fetched from backend
  const [statusFilter, setStatusFilter] = useState(null); // State to manage selected status filter
  const [expandedRows, setExpandedRows] = useState([]); // State to track expanded description rows

  useEffect(() => {
    fetchAllData(); // Fetch all data initially
  }, []);

  // Fetch all data from the backend
  const fetchAllData = async () => {
    try {
      const response = await fetch("/admin/getAllUsers"); // Fetch all users from the backend
      const result = await response.json();
      console.log("Fetched all users:", result); // Debugging log to see the fetched data
      setData(result); // Store fetched data
      setStatusFilter(null); // Reset the status filter to show all data
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // Fetch filtered data based on status
  const fetchDataByStatus = async (status) => {
    try {
      let endpoint = "/admin/getAllUsers"; // Default endpoint to get all users
      if (status === 1) endpoint = "/admin/getUsersStatus1"; // Endpoint for active status
      if (status === 0) endpoint = "/admin/getUsersStatus0"; // Endpoint for not active status
      if (status === 2) endpoint = "/admin/getUsersStatus2"; // Endpoint for waiting status

      const response = await fetch(endpoint); // Fetch data from the backend based on status
      const result = await response.json();
      console.log(`Fetched data with status ${status}:`, result); // Debugging log to see the fetched data
      setData(result); // Store fetched data
      setStatusFilter(status); // Set the current status filter
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Toggle the "Read More/Less" state
  const toggleDescription = (index) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(index)
        ? prevExpandedRows.filter((i) => i !== index)
        : [...prevExpandedRows, index]
    );
  };

  // Confirm user status
  const confirmStatus = async (userName, email) => {
    console.log("Confirm button clicked for user:", userName, email); // Debugging log

    try {
      const response = await fetch("/admin/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: userName, status: 1, email: email }), // Sending userName and status in body
      });

      console.log("Fetch request sent. Response status:", response.status); // Debugging log for the fetch request

      if (response.ok) {
        alert("Status updated to Active successfully!");
        fetchDataByStatus(0); // Refresh data for Not Active status
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update status:", errorMessage); // More detailed error logging
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  // Reject user status
  const handleReject = async (userName, email) => {
    console.log("Reject button clicked for user:", userName, email); // Debugging log
    try {
      const response = await fetch("/admin/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: userName, status: 0, email: email }), // Sending userName and status in body
      });

      console.log("Fetch request sent. Response status:", response.status); // Debugging log for the fetch request

      if (response.ok) {
        alert("Status updated to Not Active successfully!");
        fetchDataByStatus(0); // Refresh data for Not Active status
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update status:", errorMessage); // More detailed error logging
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  // Function to convert status number to text
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Not Active";
      case 1:
        return "Active";
      case 2:
        return "Waiting";
      default:
        return "";
    }
  };

  return (
    <div className="div-body">

      <main>
        {/* Section for Filter Buttons */}
        <section className="section2">
          <div className="filter-buttons">
            <button onClick={() => fetchDataByStatus(2)}>Waiting</button>
            <button onClick={() => fetchDataByStatus(1)}>Active</button>
            <button onClick={() => fetchDataByStatus(0)}>Not Active</button>
            <button onClick={() => fetchAllData()}>Show All</button>
          </div>
        </section>
        <section className="section1">
          {/* Conditionally render the table only if there is data */}
          {data.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>name</th>
                    <th>userName</th>
                    <th>email</th>
                    <th>phoneNumber</th>
                    <th>typeOfUser</th>
                    <th>subscriptionType</th>
                    <th>businessName</th>
                    <th>businessAddress</th>
                    <th>description</th>
                    <th>status</th>
                    {/* Conditionally Render Actions Column Header */}
                    {(statusFilter === 0 ||
                      statusFilter === 2 ||
                      statusFilter === 1) && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.userName}</td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.typeOfUser}</td>
                      <td>{item.subscriptionType}</td>
                      <td className="business-name">{item.businessName}</td>
                      <td>{item.businessAddress}</td>
                      <td>
                        {expandedRows.includes(index)
                          ? item.description // Show full description if expanded
                          : `${item.description.substring(0, 50)}...`}{" "}
                        {/* Show truncated description */}
                        <button onClick={() => toggleDescription(index)}>
                          {expandedRows.includes(index)
                            ? "Read less"
                            : "Read more"}
                        </button>
                      </td>
                      <td>{getStatusText(item.status)}</td>{" "}
                      {/* Render status as text */}
                      {/* Conditionally Render Actions Column Cells */}
                      {(statusFilter === 0 ||
                        statusFilter === 2 ||
                        statusFilter === 1) && (
                        <td>
                          {/* Conditionally Render Confirm Button for Waiting and Not Active Status */}
                          {(statusFilter === 2 || statusFilter === 0) && (
                            <button
                              className="confirm-button"
                              onClick={() =>
                                confirmStatus(item.userName, item.email)
                              }
                            >
                              Confirm
                            </button>
                          )}
                          {/* Conditionally Render Reject Button for Waiting Status */}
                          {(statusFilter === 2 || statusFilter === 1) && (
                            <button
                              className="reject-button"
                              onClick={() =>
                                handleReject(item.userName, item.email)
                              }
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Show this message when there is no data
            <p className="no-data-message">There are no data</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminMainPage;