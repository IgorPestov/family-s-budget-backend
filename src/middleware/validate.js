const jwt = require("jsonwebtoken");
const authHelper = require("../helper/authHelper");
const tokenModel = require("../models/tokenSchema");
const decode = require("jwt-decode");
const { json } = require("body-parser");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Token not provided!" });
    return;
  }
    const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.secret);
    if (payload.type !== "refresh") {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired!" });
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token!" });
      return;
    }
  }
  next();
};
