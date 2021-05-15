const express = require("express");
const router = express.Router();
const google = require("../controller/googleMiddleware");
const guestUser = require("../controller/guestUser");
const email = require("../controller/sendEmail");
router.get("/", (req, res) => {
  res.render("homepage", { title: "homepage" });
});

// GOOGLE LOGIN SYSTEM
router.get("/google/auth", google.googleMiddleware);
//GOOGLE REDIRECT ROUTE
router.get("/google/auth/callback", google.googleLogin);

// LOGGIN SUCESSFULLY
router.get("/login",email, (req, res) => {
  res.render("loginSucess", { title: "Login sucess" });
});

module.exports = router;
