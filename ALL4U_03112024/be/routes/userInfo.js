const express = require("express");
const userInfoController = require("../controllers/userInfoController");
const router = express.Router();

// GET /getUserInfo
router.get("/getUserInfo", userInfoController.getUserInfo);

// Add this route for fetching worker info by userName
router.get(
  "/getWorkerInfoByUserName/:userName",
  userInfoController.getWorkerInfoByUserName
);

module.exports = router;
