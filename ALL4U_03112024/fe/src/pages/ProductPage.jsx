import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NavLink } from "react-router-dom";
import "./css/productPage.css";
import { API_URL } from "../constans.js";

const ProductPage = () => {
  const { catalogNumber } = useParams(); // Get catalogNumber from the URL params
  const [product, setProduct] = useState(null); // State for the main product
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/shop/get-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const selectedProduct = data.find(
            (product) => String(product.catalogNumber) === catalogNumber
          );

          if (selectedProduct) {
            setProduct(selectedProduct);

            // Filter related products by category number
            const related = data.filter(
              (pro) =>
                pro.categoryNumber === selectedProduct.categoryNumber &&
                pro.catalogNumber !== selectedProduct.catalogNumber
            );

            setRelatedProducts(related);
          } else {
            console.error("Product not found");
          }
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [catalogNumber]);

  const addToCart = async () => {
    if (product) {
      // Check if the quantity to add is less than or equal to the available amount
      if (product.amount <= 0) {
        alert("Sorry, this product is out of stock.");
        return;
      }

      try {
        const response = await fetch("/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            catalogNumber: product.catalogNumber,
            productName: product.productName,
            price: product.price,
            quantity: 1, // Default Quantity, or you can make it dynamic
            picturePath: product.picturePath,
            size: product.size,
            color: product.color,
            userName: product.userName,
            amount: product.amount, // Ensure to include the total amount available
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        const data = await response.json();
        console.log("Product added to cart successfully:", data);
        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Error adding product to cart.");
      }
    }
  };

  // Render a loading or not found message if the product is not found
  if (!product)
    return (
      <div className="productPage-body">
        <main className="productPage-container">
          <section className="section-not-found">
            <div className="hero-content">
              <h1>Product Not Found</h1>
              <p>
                The product with catalog number "{catalogNumber}" does not
                exist.
              </p>
            </div>
          </section>
        </main>
      </div>
    );

  return (
    <div className="div-body">
      <main className="productPage-container">
        <section className="chosenProduct-section">
          <img
            src={`${API_URL}/uploads/${product.picturePath}`}
            alt={product.productName}
            className="product-image"
          />
          <div className="product-details">
            <h1 className="product-name">{product.productName}</h1>
            <p>
              <span>Price:</span> ${product.price}
            </p>
            <p>
              <span>Description:</span> {product.description}
            </p>
            <p>
              <span>Size:</span> {product.size}
            </p>
            <p>
              <span>Color:</span> {product.color}
            </p>
            <button className="add-to-cart-button" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="similarProducts-section">
          <h2>Related Products</h2>
          <ul>
            {relatedProducts.map((relatedProduct) => (
              <li key={relatedProduct.catalogNumber}>
                <NavLink to={`/Product/${relatedProduct.catalogNumber}`}>
                  <img
                    src={`${API_URL}/uploads/${relatedProduct.picturePath}`}
                    alt={relatedProduct.productName}
                    className="related-product-image"
                  />
                  <h3>{relatedProduct.productName}</h3>
                  <p>Price: ${relatedProduct.price}</p>
                  <ul>
                    <li>Description: {relatedProduct.description}</li>
                    <li>Catalog Number: {relatedProduct.catalogNumber}</li>
                    <li>Amount: {relatedProduct.amount}</li>
                    <li>Size: {relatedProduct.size}</li>
                    <li>Color: {relatedProduct.color}</li>
                  </ul>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
