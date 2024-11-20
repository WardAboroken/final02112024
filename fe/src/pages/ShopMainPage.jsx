import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./css/shopMainPage.css";
import { API_URL } from "../constans.js";
import background_img from "../assets/images/warmth_background.jpeg";

function ShopMainPage() {
  // State variables for products, user favorite categories, and loading state
  const [products, setProducts] = useState([]);
  const [userFavCategories, setUserFavCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Extract search term from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");

  // Fetch user info and set favorite categories
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          const favData = data.userInfo.preferredCategories;
          console.log("User's favorite categories:", favData);

          // Parse the preferred categories as an array
          setUserFavCategories(JSON.parse(favData) || []);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch products based on user favorites or search term
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/shop/get-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Filter products to show only those with available stock
        let filteredProducts = data.filter((product) => product.amount > 0);

        // Filter products based on search term if provided
        if (searchTerm) {
          filteredProducts = filteredProducts.filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        // Otherwise, filter by user's favorite categories
        else if (userFavCategories.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            userFavCategories.includes(product.categoryNumber)
          );
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userFavCategories, searchTerm]);

  return (
    <div className="div-body">
      <main className="shopMainPage-container">
        {/* Hero Section */}
        <section className="sectionMain">
          <div className="hero-content">
            <h1>All4U</h1>
            <p className="shopMainPage-slogan">
              The ultimate shopping experience, tailored exclusively for you.
            </p>
          </div>
          <img
            src={background_img}
            alt="backgroundImg"
            className="hero-image"
          />
        </section>

        {/* Best Sellers Section */}
        <section className="sectionBestSellers">
          {loading ? (
            <p>Loading...</p>
          ) : products.length > 0 ? (
            <>
              <h2>Best Sellers</h2>
              <ul>
                {products.slice(0, 4).map((product) => (
                  <li key={product.productId}>
                    <NavLink to={`/Product/${product.catalogNumber}`}>
                      <img
                        src={`${API_URL}/uploads/${product.picturePath}`}
                        alt={product.productName}
                      />
                      <h3>{product.productName}</h3>
                      <p>Price: ${product.price}</p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="pCategory">
              No products found for your search criteria.
            </p>
          )}
        </section>

        {/* Suggestions Section */}
        {!loading && products.length > 0 && (
          <section className="sectionProducts">
            <h2>Suggestions</h2>
            <ul>
              {products.map((product) => (
                <li key={product.productId}>
                  <NavLink to={`/Product/${product.catalogNumber}`}>
                    <img
                      src={`${API_URL}/uploads/${product.picturePath}`}
                      alt={product.productName}
                    />
                    <h3>{product.productName}</h3>
                    <p>Price: ${product.price}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default ShopMainPage;
