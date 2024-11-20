import { Route, Routes, useLocation, matchPath } from "react-router-dom";
import React from "react";

import CustomerSignUp from "./pages/CustomerSignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MainPage from "./pages/MainPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import ShopOwnerSignUp from "./pages/ShopOwnerSignUp";
import ShopMainPage from "./pages/ShopMainPage";
import CustomerOrdersHistory from "./pages/CustomerOrdersHistory";
import EditCustomerProfile from "./pages/EditCustomerProfile";
import ShopOwnerMainPage from "./pages/ShopOwnerMainPage";
import ResetPass from "./pages/ResetPass";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import BasketCart from "./pages/BasketCart";
import AdminMainPage from "./pages/AdminMainPage";
import ShopOwnerOrdersPage from "./pages/ShopOwnerOrdersPage";
import ShopOwnerProductsPage from "./pages/ShopOwnerProductsPage";
import EditShopOwnerProfile from "./pages/EditShopOwnerProfile";
import OutHeader from "./components/OutHeader";
import AdminHeader from "./components/AdminHeader";
import CustomerHeader from "./components/CustomerHeader.jsx";
import ShopOwnerHeader from "./components/ShopOwnerHeader";
import Footer from "./components/Footer.jsx";
import "./pages/css/index.css";

function App() {
  const location = useLocation(); // Access the current route

  // Function to check if the current pathname starts with any of the given prefixes
  const isPathMatching = (paths) => {
    return paths.some((path) => matchPath(path, location.pathname));
  };

  // Conditionally render headers based on current route
  const headers = {
    public: [
      "/",
      "/CustomerSignUp",
      "/Login",
      "/ForgotPassword",
      "/UserTypeSelection",
      "/ShopOwnerSignUp",
      "/ResetPass",
      "/MainPage",
    ],
    customer: [
      "/CustomerOrdersHistory",
      "/EditCustomerProfile",
      "/Product/:catalogNumber",
      "/BasketCart",
      "/ShopMainPage",
      "/ShopMainPage/:categoryName",
    ],
    shopOwner: [
      "/ShopOwnerMainPage",
      "/ShopOwnerOrdersPage",
      "/ShopOwnerProductsPage",
      "/EditShopOwnerProfile",
    ],
    admin: ["/AdminMainPage"],
  };

  const renderHeader = () => {
    if (isPathMatching(headers.public)) {
      return <OutHeader />;
    } else if (isPathMatching(headers.customer)) {
      return <CustomerHeader />;
    } else if (isPathMatching(headers.shopOwner)) {
      return <ShopOwnerHeader />;
    } else if (isPathMatching(headers.admin)) {
      return <AdminHeader />;
    }
    return null; // Optional: Return a default header or null
  };

  return (
    <div className="App">
      {renderHeader()} {/* Dynamically render the correct header */}
      <Routes className="Routes">
        {/* Public Pages */}
        <Route path="/" element={<MainPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/UserTypeSelection" element={<UserTypeSelection />} />
        <Route path="/ShopOwnerSignUp" element={<ShopOwnerSignUp />} />
        <Route path="/ShopMainPage" element={<ShopMainPage />} />
        <Route path="/ResetPass" element={<ResetPass />} />

        {/* Inside Pages */}
        <Route path="/ShopOwnerMainPage" element={<ShopOwnerMainPage />} />
        <Route path="/ShopOwnerOrdersPage" element={<ShopOwnerOrdersPage />} />
        <Route
          path="/ShopOwnerProductsPage"
          element={<ShopOwnerProductsPage />}
        />
        <Route path="/ShopMainPage/:categoryName" element={<CategoryPage />} />
        <Route
          path="/CustomerOrdersHistory"
          element={<CustomerOrdersHistory />}
        />
        <Route path="/EditCustomerProfile" element={<EditCustomerProfile />} />
        <Route path="/Product/:catalogNumber" element={<ProductPage />} />
        <Route path="/BasketCart" element={<BasketCart />} />
        <Route
          path="/EditShopOwnerProfile"
          element={<EditShopOwnerProfile />}
        />

        {/* Admin Pages */}
        <Route path="/AdminMainPage" element={<AdminMainPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
