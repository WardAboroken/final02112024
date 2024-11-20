import React, { useState, useEffect } from "react";
import "./css/customerOrderHistory.css";

const API_URL = "http://localhost:5000"; // or the correct URL for your API

const OrderDetails = ({ products }) => (
  <tr className="details-row">
    <td colSpan="4">
      <table className="products-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.catalogNumber}>
              <td>
                <img
                  src={`${API_URL}/uploads/${product.picturePath}`}
                  alt={product.productName}
                  width="50"
                />
              </td>
              <td>{product.productName}</td>
              <td>{product.productQuantity}</td>
              <td>{product.orderStatus}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${(product.price * product.productQuantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </td>
  </tr>
);

const CustomerOrdersHistory = () => {
  const [customerInfo, setCustomerInfo] = useState({ userName: "" });
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [visibleDetails, setVisibleDetails] = useState({});

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data.userInfo);
        fetchUserOrders(data.userInfo.userName);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserOrders = async (userName) => {
    try {
      const response = await fetch(`/order/getUserOrders/${userName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch user orders");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const handleDetailsClick = async (orderNumber) => {
    if (visibleDetails[orderNumber]) {
      setVisibleDetails((prev) => ({ ...prev, [orderNumber]: false }));
    } else {
      try {
        const response = await fetch(`/order/getOrderDetails/${orderNumber}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails((prev) => ({ ...prev, [orderNumber]: data }));
          setVisibleDetails((prev) => ({ ...prev, [orderNumber]: true }));
        } else {
          console.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  };

return (
  <div className="div-body">
    <main className="customerOrdersHistory-container">
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Shipping Address</th>
              <th>Order Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ orderNumber, shippingAddress, orderDate }) => (
              <React.Fragment key={orderNumber}>
                <tr>
                  <td>{orderNumber}</td>
                  <td>{shippingAddress}</td>
                  <td>{new Date(orderDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleDetailsClick(orderNumber)}
                    >
                      {visibleDetails[orderNumber]
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                  </td>
                </tr>
                {visibleDetails[orderNumber] && orderDetails[orderNumber] && (
                  <OrderDetails products={orderDetails[orderNumber]} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-orders">No orders have been placed yet</p>
      )}
    </main>
  </div>
);

};

export default CustomerOrdersHistory;
