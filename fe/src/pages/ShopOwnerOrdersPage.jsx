import React, { useState, useEffect } from "react";
import "./css/shopOwnerOrdersPage.css";
import { useLocation } from "react-router-dom";

const ShopOwnerOrdersPage = () => {
  // State variables for managing orders, search term, filters, and order details
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All Orders");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const autoExpandOrderNumber = queryParams.get("orderNumber");

  // Fetch user orders and business owner information
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          console.error("Failed to fetch user info");
          return;
        }
        const data = await res.json();
        const businessOwnerId = data.userInfo.userName;

        if (!businessOwnerId) {
          console.error("Business owner ID is undefined.");
          return;
        }

        setUserName(businessOwnerId);

        // Fetch orders for the business owner
        const response = await fetch(
          `/order/getBusinessOrders/${businessOwnerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data);

          // Automatically expand the details of the specified order
          if (autoExpandOrderNumber) {
            const orderExists = data.some(
              (order) => order.orderNumber.toString() === autoExpandOrderNumber
            );
            if (orderExists) {
              fetchOrderDetails(autoExpandOrderNumber);
            }
          }
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [autoExpandOrderNumber]);

  // Fetch detailed information for a specific order
  const fetchOrderDetails = async (orderNumber) => {
    if (!orderNumber) return;

    try {
      const response = await fetch(`/order/getOrderDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, userName }),
      });
      if (response.ok) {
        const data = await response.json();
        const { orderDetails, userName } = data;

        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          [orderNumber]: { orderDetails, userName },
        }));
        setVisibleDetails((prevDetails) => ({
          ...prevDetails,
          [orderNumber]: true,
        }));
      } else {
        console.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Effect to auto-expand order details when a specific order is loaded
  useEffect(() => {
    if (autoExpandOrderNumber && filteredOrders.length > 0) {
      fetchOrderDetails(autoExpandOrderNumber);
    }
  }, [autoExpandOrderNumber, filteredOrders]);

  // Toggle visibility of order details
  const toggleDetails = (orderNumber) => {
    if (visibleDetails[orderNumber]) {
      setVisibleDetails((prevDetails) => ({
        ...prevDetails,
        [orderNumber]: false,
      }));
    } else {
      fetchOrderDetails(orderNumber);
    }
  };

  // Update the status of an order
  const updateOrderStatus = async (orderNumber, catalogNumbers, newStatus) => {
    try {
      const response = await fetch(
        `/order/updateOrderStatus/${orderNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ catalogNumbers, status: newStatus }),
        }
      );

      if (response.ok) {
        console.log("Order status updated successfully");
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle status change for a specific order and update the UI
  const handleStatusChange = (orderNumber, catalogNumbers, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderNumber === orderNumber
          ? { ...order, status: newStatus }
          : order
      )
    );

    updateOrderStatus(orderNumber, catalogNumbers.split(","), newStatus)
      .then(() => {
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, status: newStatus }
              : order
          )
        );
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  // Filter orders based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredOrders(
      orders.filter((order) =>
        order.orderNumber.toString().includes(e.target.value)
      )
    );
  };

  // Filter orders by selected status
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    if (e.target.value === "All Orders") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === e.target.value)
      );
    }
  };

  // Display loading message while orders are being fetched
  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="div-body ">
      <main className="shopOwnerMainPage-main ">
        <section className="order-list-section">
          <div className="orders-list-header">
            <h1>Orders List</h1>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search order..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div>
              <select
                className="filter-select"
                value={selectedFilter}
                onChange={handleFilterChange}
              >
                <option value="All Orders">All Orders</option>
                <option value="Received">Received</option>
                <option value="In preparation">In preparation</option>
                <option value="Ready">Ready</option>
                <option value="Underway">Underway</option>
                <option value="Been Provided">Been Provided</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderNumber}>
                      <td>{order.orderNumber}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.orderNumber,
                              order.catalogNumbers,
                              e.target.value
                            )
                          }
                        >
                          <option value="Received">Received</option>
                          <option value="In preparation">In preparation</option>
                          <option value="Ready">Ready</option>
                          <option value="Underway">Underway</option>
                          <option value="Been Provided">Been Provided</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="details-button"
                          onClick={() => toggleDetails(order.orderNumber)}
                        >
                          Details
                        </button>
                        {visibleDetails[order.orderNumber] && (
                          <>
                            {/* Customer Details Table */}
                            <table className="customer-details-table">
                              <thead>
                                <tr>
                                  <th>Customer Name</th>
                                  <th>Customer PhoneNumber</th>
                                  <th>Customer Location</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderDetails[order.orderNumber].orderDetails
                                  .slice(0, 1) // Show first item for customer details
                                  .map((product, index) => (
                                    <tr key={index}>
                                      <td>{product.name}</td>
                                      <td>{product.phoneNumber}</td>
                                      <td>{product.address}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>

                            {/* Product Details Table */}
                            <table className="order-details-table">
                              <thead>
                                <tr>
                                  <th>Catalog Number</th>
                                  <th>Product Name</th>
                                  <th>Amount</th>
                                  <th>Size</th>
                                  <th>Color</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderDetails[
                                  order.orderNumber
                                ].orderDetails.map((product, index) => (
                                  <tr key={index}>
                                    <td>{product.catalogNumber}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.amount}</td>
                                    <td>{product.size}</td>
                                    <td>{product.color}</td>
                                    <td>${product.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-orders-message">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <div>
          <a className="sales-link" href="/shopOwnerMainPage#sales-overview">
            Click here to view your sales progress →
          </a>
        </div>
      </main>
    </div>
  );
};

export default ShopOwnerOrdersPage;
