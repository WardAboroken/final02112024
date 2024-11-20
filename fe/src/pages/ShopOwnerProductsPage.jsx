import React, { useState, useEffect } from "react";
import "./css/shopOwnerProductsPage.css";
import { API_URL } from "../constans.js";
import { useLocation } from "react-router-dom"; // Import useLocation

// Helper function to find category name by number
const getCategoryName = (categoryNumber, categories) =>
  Object.keys(categories).find((key) => categories[key] === categoryNumber);

// Define categories with associated numbers
const categories = {
  Toys: 1,
  Clothing: 2,
  "Work Tools": 3,
  "Pet Supplies": 4,
  "Home Styling": 5,
  Cleaning: 6,
  Shoes: 7,
  Sport: 8,
  Accessories: 9,
  Furnishing: 10,
  Safety: 11,
  Beauty: 12,
};

// Activity status options
const activityOptions = ["Active", "Not Active"];

// Main component for displaying, adding, editing, and deleting products
const ShopOwnerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null); // Tracks which product is being edited
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    catalogNumber: "",
    productName: "",
    description: "",
    color: "",
    size: "",
    status: "",
    amount: 0,
    price: 0,
    imageLink: "",
    categoryNumber: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddProductForm, setShowAddProductForm] = useState(false); // Toggle Add Product form visibility
  const location = useLocation(); // Hook to get the current URL
  const queryParams = new URLSearchParams(location.search);
  const catalogNumberFromURL = queryParams.get("catalogNumber");

  // Fetches user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userInfo.userName);
        } else {
          setError("Failed to fetch user info.");
        }
      } catch (error) {
        setError("Error fetching user info.");
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetches products associated with the user
  useEffect(() => {
    if (userName) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/shop/getAllProducts?userName=${userName}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);

            // Automatically open the edit form if the catalogNumber is in the URL
            if (catalogNumberFromURL) {
              const productToEdit = data.find(
                (product) =>
                  product.catalogNumber.toString() === catalogNumberFromURL
              );
              if (productToEdit) {
                toggleEditForm(productToEdit); // Auto-open the edit form for the matching product
              }
            }
          } else {
            setError("Failed to fetch products.");
          }
        } catch (error) {
          setError("Error fetching products.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [userName, catalogNumberFromURL]); // Dependency array now includes catalogNumberFromURL

  // Handles input changes for the new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Filters products based on search term
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);

    const filtered = products.filter((product) => {
      const catalogNumber = String(product.catalogNumber || "").toLowerCase();
      const productName = product.productName.toLowerCase();

      return (
        catalogNumber.startsWith(searchValue) ||
        productName.includes(searchValue)
      );
    });

    const sorted = filtered.sort((a, b) => {
      const catalogNumberA = String(a.catalogNumber || "").toLowerCase();
      const catalogNumberB = String(b.catalogNumber || "").toLowerCase();
      const productNameA = a.productName.toLowerCase();
      const productNameB = b.productName.toLowerCase();

      const catalogStartsWithA = catalogNumberA.startsWith(searchValue);
      const catalogStartsWithB = catalogNumberB.startsWith(searchValue);
      const nameStartsWithA = productNameA.startsWith(searchValue);
      const nameStartsWithB = productNameB.startsWith(searchValue);

      if (catalogStartsWithA && !catalogStartsWithB) return -1;
      if (!catalogStartsWithA && catalogStartsWithB) return 1;
      if (nameStartsWithA && !nameStartsWithB) return -1;
      if (!nameStartsWithA && nameStartsWithB) return 1;

      return 0;
    });

    setFilteredProducts(sorted);
  };

  // Adds a new product to the list
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });
    formData.append("userName", userName);

    try {
      const response = await fetch("/productsHandler/addProduct", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prev) => [...prev, addedProduct]);
        setFilteredProducts((prev) => [...prev, addedProduct]);
        setNewProduct({
          catalogNumber: "",
          productName: "",
          description: "",
          color: "",
          size: "",
          amount: 0,
          price: 0,
          imageLink: "",
          categoryNumber: 0,
        });
        setShowAddProductForm(false); // Hide the form after adding a product
      } else {
        setError("Failed to add product.");
      }
    } catch (error) {
      setError("Error adding product.");
      console.error(error);
    }
  };

  // Edits an existing product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editProduct).forEach((key) => {
      formData.append(key, editProduct[key]);
    });

    try {
      const response = await fetch(
        `/productsHandler/updateProduct/${editProduct.catalogNumber}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((product) =>
            product.catalogNumber === updatedProduct.catalogNumber
              ? updatedProduct
              : product
          )
        );
        setFilteredProducts((prev) =>
          prev.map((product) =>
            product.catalogNumber === updatedProduct.catalogNumber
              ? updatedProduct
              : product
          )
        );
        setEditProductId(null); // Close edit form
        setEditProduct(null);
      } else {
        setError("Failed to update product.");
      }
    } catch (error) {
      setError("Error updating product.");
      console.error(error);
    }
  };

  // Deletes a product from the list by updating its status to inactive
  const handleDeleteProduct = async (catalogNumber) => {
    try {
      const response = await fetch(
        `/productsHandler/updateProductStatus/${catalogNumber}`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setProducts((prev) =>
          prev.filter((product) => product.catalogNumber !== catalogNumber)
        );
        setFilteredProducts((prev) =>
          prev.filter((product) => product.catalogNumber !== catalogNumber)
        );
      } else {
        setError("Failed to delete product.");
      }
    } catch (error) {
      setError("Error deleting product.");
      console.error(error);
    }
  };

  // Toggles the edit form for a specific product
  const toggleEditForm = (product) => {
    setEditProductId(
      product.catalogNumber === editProductId ? null : product.catalogNumber
    );
    setEditProduct({ ...product });
  };

  // Cancels editing a product
  const handleCancelEdit = () => {
    setEditProductId(null);
    setEditProduct(null);
    setError(""); // Clear any existing error messages if needed
  };

  return (
    <div className="div-body">
      <main className="shopOwnerMainPage-main">
        {error && <div className="error-message">{error}</div>}
        {loading && <div>Loading...</div>}
        <section className="product-list-section">
          <div className="products-list-header">
            <h1>Products List</h1>
            <button
              className="add-product-button"
              onClick={() => setShowAddProductForm(!showAddProductForm)} // Toggle form visibility
            >
              {showAddProductForm ? "Hide Add Product" : "Add Product"}
            </button>
          </div>

          {/* Conditionally render the Add Product form ABOVE the search bar */}
          {showAddProductForm && (
            <AddProductForm
              newProduct={newProduct}
              handleInputChange={handleInputChange}
              handleAddProduct={handleAddProduct}
            />
          )}

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by Catalogue Number or Product Name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>Catalogue Number</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Color</th>
                <th>Size</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Picture</th>
                <th>Price</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <React.Fragment key={product.catalogNumber}>
                  <tr>
                    <td>{product.catalogNumber}</td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.color}</td>
                    <td>{product.size}</td>
                    <td>
                      {getCategoryName(product.categoryNumber, categories)}
                    </td>
                    <td>{product.amount}</td>
                    <td>
                      <img
                        src={`${API_URL}/uploads/${product.picturePath}`}
                        alt={product.productName}
                        width="50"
                      />
                    </td>
                    <td>${product.price}</td>
                    <td>{product.status}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          onClick={() => toggleEditForm(product)}
                        >
                          <i className="fas fa-edit icon">Edit</i>
                        </button>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteProduct(product.catalogNumber)
                          }
                        >
                          <i className="fas fa-trash icon"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editProductId === product.catalogNumber && (
                    <tr>
                      <td colSpan="10">
                        <EditProductForm
                          editProduct={editProduct}
                          setEditProduct={setEditProduct}
                          handleEditProduct={handleEditProduct}
                          handleCancelEdit={handleCancelEdit} // Pass the cancel handler
                          categories={categories}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

const AddProductForm = ({
  newProduct,
  handleInputChange,
  handleAddProduct,
}) => {
  return (
    <section className="add-product-section">
      <h2>Add Product</h2>
      <form
        className="add-product-form"
        onSubmit={handleAddProduct}
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="catalogNumber"
          placeholder="Catalogue number"
          value={newProduct.catalogNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="productName"
          placeholder="Product name"
          value={newProduct.productName}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={newProduct.color}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={newProduct.size}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newProduct.amount}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="picturePath"
          accept="image/*"
          onChange={(e) =>
            handleInputChange({
              target: { name: "picturePath", value: e.target.files[0] },
            })
          }
        />
        <select
          name="categoryNumber"
          value={newProduct.categoryNumber}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </section>
  );
};

const EditProductForm = ({
  editProduct,
  setEditProduct,
  handleEditProduct,
  handleCancelEdit, // Receive the cancel handler
  categories,
}) => {
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: name === "categoryNumber" ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (e) => {
    setEditProduct((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  return (
    <div className="edit-product-form">
      <h3>Edit Product</h3>
      <form onSubmit={handleEditProduct}>
        <input
          type="text"
          name="catalogNumber"
          placeholder="Catalogue Number"
          value={editProduct.catalogNumber || ""}
          onChange={handleEditChange}
          disabled
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={editProduct.productName || ""}
          onChange={handleEditChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editProduct.description || ""}
          onChange={handleEditChange}
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={editProduct.color || ""}
          onChange={handleEditChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={editProduct.size || ""}
          onChange={handleEditChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={editProduct.amount || 0}
          min={0}
          onChange={handleEditChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editProduct.price || 0}
          min={0}
          onChange={handleEditChange}
        />
        <select
          name="categoryNumber"
          value={editProduct.categoryNumber || ""}
          onChange={handleEditChange}
        >
          <option value="">Select Category</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={editProduct.status || ""}
          onChange={handleEditChange}
        >
          <option value="" disabled>
            Select status
          </option>
          {activityOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input type="file" name="picture" onChange={handleFileChange} />
        <div className="button-container">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopOwnerProductsPage;
