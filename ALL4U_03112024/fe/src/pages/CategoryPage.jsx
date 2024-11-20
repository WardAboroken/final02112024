import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./css/shopMainPage.css";
import background_img from "../assets/images/warmth_background.jpeg";
import { API_URL } from "../constans.js";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryNumber, setCategoryNumber] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category mapping
  const categories = {
    Toys: 1,
    Clothing: 2,
    WorkTools: 3,
    PetSupplies: 4,
    HomeStyling: 5,
    Cleaning: 6,
    Shoes: 7,
    Sport: 8,
    Accessories: 9,
    Furnishing: 10,
    Safety: 11,
    Beauty: 12,
  };

  useEffect(() => {
    const categoryNum = categories[categoryName];
    setCategoryNumber(categoryNum);

    // If the category does not exist, stop loading
    if (!categoryNum) {
      setLoading(false);
      console.error(`Category "${categoryName}" does not exist.`);
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
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

        // Filter products by category
        const filteredProducts = data.filter(
          (product) => product.categoryNumber === categoryNum
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Reusable Product List component for both Best Sellers and Suggestions
  const renderProductsList = (productsList, limit) => (
    <ul>
      {productsList.slice(0, limit).map((product) => (
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
  );

  // Loading state
  if (loading) return <p>Loading products...</p>;

  // Handle category not found
  if (!categoryNumber)
    return (
      <div className="shopMainPage-body">
        <main className="shopMainPage-container">
          <section className="sectionMain">
            <div className="hero-content">
              <h1>Category Not Found</h1>
              <p>The category "{categoryName}" does not exist.</p>
            </div>
            <img src={background_img} alt="backgroundImg" />
          </section>
        </main>
      </div>
    );

  return (
    <div className="div-body">
      <main className="shopMainPage-container">
        {/* Hero Section */}
        <section className="sectionMain">
          <div className="hero-content">
            <h1>{categoryName}</h1>
          </div>
          <img src={background_img} alt="Category Background" />
        </section>

        {/* Best Sellers Section */}
        <section className="sectionBestSellers">
          {products.length > 0 ? (
            <>
              <h2>Best Sellers</h2>
              {renderProductsList(products, 4)} {/* Show top 4 products */}
            </>
          ) : (
            <p className="pCategory">
              There are currently no products available in this category.
            </p>
          )}
        </section>

        {/* Suggestions Section */}
        {products.length > 0 && (
          <section className="sectionProducts">
            <h2>Suggestions</h2>
            {renderProductsList(products, products.length)}{" "}
            {/* Show all products */}
          </section>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
