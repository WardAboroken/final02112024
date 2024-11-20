import React, { useState, useEffect, useRef } from "react";
import "./css/index.css";
import "./css/shopOwnerMainPage.css";
import { API_URL } from "../constans.js";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import SalesOverview from "../components/SalesOverview.jsx";

Chart.register(...registerables);

function ShopOwnerMainPage() {
  const salesOverviewRef = useRef(null);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState("");
  const [error, setError] = useState(null);
  const productsContainerRef = useRef(null);
  const ordersContainerRef = useRef(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorOrders, setErrorOrders] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [errorGraph, setErrorGraph] = useState(null);
  const navigate = useNavigate();
  const [barGraphData, setBarGraphData] = useState({});
  const [pieGraphData, setPieGraphData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Delay scroll to Sales Overview section by 3 seconds if #sales-overview hash is in URL
  useEffect(() => {
    if (
      window.location.hash === "#sales-overview" &&
      salesOverviewRef.current
    ) {
      setTimeout(() => {
        salesOverviewRef.current.scrollIntoView({ behavior: "smooth" });
      }, 500); // 3-second delay
    }
  }, []);

  // Fetch user info to get the logged-in business owner's username
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.userInfo);
          setError(null);
        } else {
          setError("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Error fetching user info");
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch out-of-stock products
  useEffect(() => {
    if (!userInfo.userName) return;
    const fetchOutOfStockProducts = async () => {
      try {
        const response = await fetch(
          `/order/get-out-of-stock-products/${userInfo.userName}`
        );
        if (response.ok) {
          const data = await response.json();
          setOutOfStockProducts(data || []);
          setLoadingProducts(false);
        } else {
          setErrorProducts("Failed to fetch out-of-stock products.");
          setLoadingProducts(false);
        }
      } catch (error) {
        console.error("Error fetching out-of-stock products:", error);
        setErrorProducts("Error fetching out-of-stock products.");
        setLoadingProducts(false);
      }
    };

    fetchOutOfStockProducts();
  }, [userInfo.userName]);

  // Fetch new orders
  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const response = await fetch(
          `/order/get-business-new-orders/${userInfo.userName}`
        );
        if (response.ok) {
          const data = await response.json();
          setNewOrders(data);
        } else {
          setErrorOrders("Failed to fetch new orders.");
        }
      } catch (error) {
        setErrorOrders("Error fetching new orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.userName) {
      fetchNewOrders();
    }
  }, [userInfo.userName]);

  // Helper function to get the first day of the current month and today's date
  const getCurrentMonthDateRange = () => {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    return {
      startDate: firstDayCurrentMonth.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  };

  // Declare default dates outside of useEffect
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getCurrentMonthDateRange();

  // Automatically fetch graph data based on date range
  useEffect(() => {
    const fetchStartDate = startDate || defaultStartDate;
    const fetchEndDate = endDate || defaultEndDate;

    if (!userInfo.userName) return;

    const fetchGraphData = async () => {
      setLoadingGraph(true);
      setErrorGraph(null);

      try {
        const isSameDay = fetchStartDate === fetchEndDate;

        const response = await fetch(
          `/order/get-been-provided-orders/${
            userInfo.userName
          }?startDate=${encodeURIComponent(
            fetchStartDate
          )}&endDate=${encodeURIComponent(fetchEndDate)}`
        );

        if (response.ok) {
          const data = await response.json();

          const filteredData = data.filter((order) => {
            const orderDate = new Date(order.date);
            const start = new Date(fetchStartDate);
            const end = new Date(fetchEndDate);

            if (isSameDay) {
              return orderDate.toDateString() === start.toDateString();
            }

            return orderDate >= start && orderDate <= end;
          });

          const labels = filteredData.map((order) =>
            new Date(order.date).toLocaleDateString()
          );
          const totalAmounts = filteredData.map((order) => order.totalCost);

          setGraphData({
            labels,
            datasets: [
              {
                label: "Sales ($)",
                data: totalAmounts,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
              },
            ],
          });

          setBarGraphData({
            labels,
            datasets: [
              {
                label: "Sales ($)",
                data: totalAmounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          });

          setPieGraphData({
            labels,
            datasets: [
              {
                label: "Sales Distribution",
                data: totalAmounts,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          });

          setLoadingGraph(false);
        } else {
          setErrorGraph("Failed to fetch graph data.");
          setLoadingGraph(false);
        }
      } catch (error) {
        setErrorGraph("Error fetching graph data.");
        setLoadingGraph(false);
      }
    };

    fetchGraphData();
  }, [userInfo.userName, startDate, endDate, defaultStartDate, defaultEndDate]);

  // Navigate to Orders page and show order details
  const handleSelectOrder = (orderNumber) => {
    navigate(`/ShopOwnerOrdersPage?orderNumber=${orderNumber}`); // Navigate with orderNumber in query
  };

  // Navigate to the edit product page
  const handleEditProduct = (catalogNumber) => {
    navigate(`/ShopOwnerProductsPage?catalogNumber=${catalogNumber}`); // Navigate with catalogNumber in query
  };

  // Helper function to scroll containers
  const scroll = (direction, containerRef) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="div-body">
      <main className="shopOwnerMainPage-main">
        <h1>{userInfo.businessName}</h1>
        {/* Out of Stock Products Section */}
        {outOfStockProducts.length > 0 && (
          <section className="out-of-stock-products">
            <h2 className="section-title">Out Of Stock Products</h2>
            {loadingProducts ? (
              <p>Loading...</p>
            ) : errorProducts ? (
              <p>{errorProducts}</p>
            ) : (
              <div className="arrow-container">
                <button
                  className="arrow arrow-left"
                  onClick={() => scroll("left", productsContainerRef)}
                >
                  &lt;
                </button>
                <div className="products-container" ref={productsContainerRef}>
                  {outOfStockProducts.map((product) => (
                    <div key={product.catalogNumber} className="product-card">
                      <p className="catalog-number">
                        Catalogue number: {product.catalogNumber}
                      </p>
                      <h3 className="product-name">{product.productName}</h3>
                      <img
                        src={`${API_URL}/uploads/${product.picturePath}`}
                        alt={product.productName}
                        className="product-image"
                      />
                      <button
                        className="replenish-button"
                        onClick={() => handleEditProduct(product.catalogNumber)}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="arrow arrow-right"
                  onClick={() => scroll("right", productsContainerRef)}
                >
                  &gt;
                </button>
              </div>
            )}
          </section>
        )}
        {/* New Orders Section */}
        {(loading || newOrders.length > 0) && (
          <section className="new-orders-section">
            <h2 className="section-title">New Orders</h2>
            <div className="arrow-container">
              <button
                className="arrow arrow-left"
                onClick={() => scroll("left", ordersContainerRef)}
              >
                &lt;
              </button>
              <div className="orders-container" ref={ordersContainerRef}>
                {loading ? (
                  <p>Loading...</p>
                ) : errorOrders ? (
                  <p>{errorOrders}</p>
                ) : newOrders.length === 0 ? (
                  <p>No new orders available.</p>
                ) : (
                  newOrders.map((order) => (
                    <div key={order.orderNumber} className="order-card">
                      <h4>Order number {order.orderNumber}</h4>
                      <p className="order-total-cost">
                        ${order.totalCost} TOTAL COST
                      </p>
                      <ul className="order-items-list">
                        <li>
                          Order Date:{" "}
                          {new Date(order.date).toLocaleDateString()}
                        </li>
                      </ul>
                      <button
                        className="select-button"
                        onClick={() => handleSelectOrder(order.orderNumber)}
                      >
                        Select
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                className="arrow arrow-right"
                onClick={() => scroll("right", ordersContainerRef)}
              >
                &gt;
              </button>
            </div>
          </section>
        )}

        {/* Graph Section */}
        <SalesOverview userInfo={userInfo} />
      </main>
    </div>
  );
}

export default ShopOwnerMainPage;
