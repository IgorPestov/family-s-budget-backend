const express = require("express");
const auth = express.Router();
const authControllers = require("../controllers/auth");

auth.post("/login", authControllers.login);
auth.post("/signup", authControllers.signup);
auth.post("/check-mail", authControllers.checkEmailForResetPasword);
auth.post("/reset-password", authControllers.resetPassword);
auth.post("/invite-new-user" ,authControllers.inviteNewUser)
module.exports = auth;
