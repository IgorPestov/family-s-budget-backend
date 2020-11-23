const express = require("express");
const auth = express.Router();
const authControllers = require("../controllers/auth");

auth.post("/login", authControllers.login);
auth.post("/signup", authControllers.signup);
auth.post("/check-mail", authControllers.checkEmailForResetPasword);
auth.post("/reser-password", authControllers.resetPassword);

module.exports = auth;
