const express = require("express");
const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// CORS
app.use(cors());

// JSON parser
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Routes
const loginRoutes = require("./routes/login");
const userInfoRoutes = require("./routes/userInfo");
const addNewUserRoutes = require("./routes/addNewUser");
const updateProfileRoutes = require("./routes/updateProfile");
const shopRoutes = require("./routes/shop");
const recoveryPswRoutes = require("./routes/recoveryPsw");
const cartRoutes = require("./routes/cart"); // Import the cart route
const admin = require("./routes/admin");
const productsHandler = require("./routes/productsHandler");
const order = require("./routes/order");

app.use("/login", loginRoutes);
app.use("/userInfo", userInfoRoutes);
app.use("/addNewUser", addNewUserRoutes);
app.use("/updateProfile", updateProfileRoutes);
app.use("/shop", shopRoutes);
app.use("/recoveryPsw", recoveryPswRoutes);
app.use("/cart", cartRoutes); // Use the cart route
app.use("/admin", admin);
app.use("/productsHandler", productsHandler);
app.use("/order", order);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
