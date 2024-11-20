const express = require("express");
const loginController = require("../controllers/loginController");
const router = express.Router();

// POST /login


router.post("/loginController", loginController.handleLogin);



module.exports = router;
