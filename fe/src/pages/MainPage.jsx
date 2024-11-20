import React, { useState, useEffect } from "react";
import img from "../assets/images/artist photographer photography david welch-1.jpeg";
import "./css/mainPage.css";
import { API_URL } from "../constans"; // Ensure this constant is correctly defined

function MainPage() {
  // State for storing random products and loading status
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref to handle horizontal scrolling of the product list
  const productsContainerRef = React.useRef(null);

  // Fetch random products from the backend when the component mounts
  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/shop/random-products`);
        const data = await response.json();
        setRandomProducts(data); // Update state with fetched products
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch random products:", error);
        setLoading(false); // Ensure loading ends even if there is an error
      }
    };

    fetchRandomProducts();
  }, []);

  // Scroll function to move the product list left or right
  const scroll = (direction, containerRef) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mainPage-body">
      <main className="main-content">
        <div className="content-wrapper">
          {/* Introduction Section */}
          <div className="introduction">
            <h1 className="DivTitle">Welcome to All4U!</h1>
            <h4>
              Your personalized online shopping experience, made just for you.
            </h4>
            <p>
              All4U is designed to make your shopping experience seamless and
              enjoyable. We provide detailed information on each product,
              helping you create a shopping list that’s convenient and secure,
              tailored exactly to your needs.
              <br />
              <br />
              Explore a wide variety of products across different categories,
              each one carefully selected to match your unique style and
              preferences.
              <br />
              Take your time, browse our collections, and discover the perfect
              products for you. Enjoy your shopping experience!
            </p>
            <p className="pForInfo">
              WE’RE HERE FOR YOU! <br />
              Have any questions? Reach us at:
              <br />
              &#9993;
              <a href="mailto:wardaboroken@gmail.com">
                wardaboroken@gmail.com
              </a>{" "}
              <br />
              &#9993;
              <a href="mailto:taleemaddah@gmail.com">taleemaddah@gmail.com</a>
            </p>
          </div>

          {/* Image Section */}
          <div className="products-image">
            <img src={img} alt="Beautiful product showcase" />
          </div>
        </div>
      </main>

      {/* Random Products Section */}
      <section className="random-products">
        <h2 className="section-title">Take a look on our products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : randomProducts.length > 0 ? (
          <div className="arrow-container">
            {/* Left arrow button for scrolling */}
            <button
              className="arrow arrow-left"
              onClick={() => scroll("left", productsContainerRef)}
            >
              &lt;
            </button>

            {/* Container displaying random products */}
            <div className="products-container" ref={productsContainerRef}>
              {randomProducts.map((product) => (
                <div key={product.productId} className="product-card">
                  <h3 className="product-name">{product.productName}</h3>
                  <img
                    src={`${API_URL}/uploads/${product.picturePath}`}
                    alt={product.productName}
                    className="product-image"
                  />
                  <p className="product-price">Price: ${product.price}</p>
                </div>
              ))}
            </div>

            {/* Right arrow button for scrolling */}
            <button
              className="arrow arrow-right"
              onClick={() => scroll("right", productsContainerRef)}
            >
              &gt;
            </button>
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
}

export default MainPage;
