// SalesOverview.jsx
import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../pages/css/salesOverview.css";

// Register Chart.js components
Chart.register(...registerables);

function SalesOverview({ userInfo }) {
  // State for chart data and configuration
  const [graphData, setGraphData] = useState(null); // Data for Line chart
  const [barGraphData, setBarGraphData] = useState({}); // Data for Bar chart
  const [pieGraphData, setPieGraphData] = useState({}); // Data for Pie chart
  const [loadingGraph, setLoadingGraph] = useState(true); // Loading state for graphs
  const [errorGraph, setErrorGraph] = useState(null); // Error state for graphs
  const [startDate, setStartDate] = useState(""); // Start date for data filtering
  const [endDate, setEndDate] = useState(""); // End date for data filtering
  const [selectedChart, setSelectedChart] = useState("Line"); // Tracks the selected chart type

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

  // Destructure default start and end dates from helper function
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getCurrentMonthDateRange();

  // Fetch and process graph data whenever userInfo, startDate, or endDate changes
  useEffect(() => {
    const fetchStartDate = startDate || defaultStartDate;
    const fetchEndDate = endDate || defaultEndDate;

    // Return if userInfo is not available
    if (!userInfo.userName) return;

    // Function to fetch and process data for the charts
    const fetchGraphData = async () => {
      setLoadingGraph(true); // Set loading state
      setErrorGraph(null); // Reset error state

      try {
        // Fetch data from the server
        const response = await fetch(
          `/order/get-been-provided-orders/${
            userInfo.userName
          }?startDate=${encodeURIComponent(
            fetchStartDate
          )}&endDate=${encodeURIComponent(fetchEndDate)}`
        );

        // If the response is successful
        if (response.ok) {
          const data = await response.json();

          // Aggregate data by date (summing total sales for each date)
          const aggregatedData = data.reduce((acc, order) => {
            const orderDate = new Date(order.date).toLocaleDateString();
            if (!acc[orderDate]) {
              acc[orderDate] = 0;
            }
            acc[orderDate] += order.totalCost;
            return acc;
          }, {});

          // Prepare data for the chart
          const labels = Object.keys(aggregatedData);
          const totalAmounts = Object.values(aggregatedData);

          // Update state for Line chart data
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

          // Update state for Bar chart data
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

          // Update state for Pie chart data
          setPieGraphData({
            labels,
            datasets: [
              {
                label: "Sales Distribution ($)",
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

          setLoadingGraph(false); // Set loading to false after successful fetch
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

  return (
    <section className="graph-section">
      <h2 className="section-title">Sales Overview</h2>

      {/* Date Range Picker */}
      <div className="date-range-picker">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Chart Selection Buttons */}
      <div className="chart-selection">
        <button
          onClick={() => setSelectedChart("Line")}
          className={selectedChart === "Line" ? "active" : ""}
        >
          Line Chart
        </button>
        <button
          onClick={() => setSelectedChart("Bar")}
          className={selectedChart === "Bar" ? "active" : ""}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setSelectedChart("Pie")}
          className={selectedChart === "Pie" ? "active" : ""}
        >
          Pie Chart
        </button>
      </div>

      {/* Chart Display */}
      {loadingGraph ? (
        <p>Loading graph...</p> // Display loading message while data is being fetched
      ) : errorGraph ? (
        <p>{errorGraph}</p> // Display error message if there was an issue fetching data
      ) : (
        <div className="chart-container">
          {/* Render Line Chart */}
          {selectedChart === "Line" && (
            <div className="chart-item">
              <h3>Line Chart</h3>
              <Line data={graphData} width={200} height={200} />
            </div>
          )}
          {/* Render Bar Chart */}
          {selectedChart === "Bar" && (
            <div className="chart-item">
              <h3>Bar Chart</h3>
              <Bar data={barGraphData} width={200} height={200} />
            </div>
          )}
          {/* Render Pie Chart */}
          {selectedChart === "Pie" && (
            <div className="chart-item">
              <h3>Pie Chart</h3>
              <Pie data={pieGraphData} width={200} height={200} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default SalesOverview;
