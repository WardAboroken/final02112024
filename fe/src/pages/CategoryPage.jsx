import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./css/shopMainPage.css";
import background_img from "../assets/images/warmth_background.jpeg";
import { API_URL } from "../constans.js";

const CategoryPage = () => {
  // Extract the category name from URL parameters
  const { categoryName } = useParams();

  // Define state variables for category number, products, and loading indicator
  const [categoryNumber, setCategoryNumber] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping category names to their respective category numbers
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

  // Fetch the category and products whenever the category name changes
  useEffect(() => {
    const categoryNum = categories[categoryName];
    setCategoryNumber(categoryNum);

    // Stop loading if the category does not exist
    if (!categoryNum) {
      setLoading(false);
      console.error(`Category "${categoryName}" does not exist.`);
      return;
    }

    // Fetch products from the API
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

        // Filter products to only include those in the current category
        const filteredProducts = data.filter(
          (product) => product.categoryNumber === categoryNum
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Stop loading after fetching products
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Reusable component for displaying a list of products with a specified limit
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

  // Display loading message while fetching data
  if (loading) return <p>Loading products...</p>;

  // Display a message if the category is not found
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
        {/* Hero section displaying the category name and background image */}
        <section className="sectionMain">
          <div className="hero-content">
            <h1>{categoryName}</h1>
          </div>
          <img src={background_img} alt="Category Background" />
        </section>

        {/* Best Sellers section with top 4 products */}
        <section className="sectionBestSellers">
          {products.length > 0 ? (
            <>
              <h2>Best Sellers</h2>
              {renderProductsList(products, 4)} {/* Display top 4 products */}
            </>
          ) : (
            <p className="pCategory">
              There are currently no products available in this category.
            </p>
          )}
        </section>

        {/* Suggestions section displaying all products in the category */}
        {products.length > 0 && (
          <section className="sectionProducts">
            <h2>Suggestions</h2>
            {renderProductsList(products, products.length)}{" "}
            {/* Display all products */}
          </section>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
