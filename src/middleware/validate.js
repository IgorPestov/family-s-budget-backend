
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/authHelper")
const tokenModel = require("../models/tokenSchema")
const decode = require("jwt-decode")
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Token not provided!" });
    return;
  }
  const token = authHeader.replace("Bearer ", "");
  const tokenId = decode(token).id
  const tokenCheck = await tokenModel.findOne({tokenId})

 const test = await authHelper.updateTokens(tokenCheck.userId)
  try {   
   const payload = jwt.verify(test.accessToken, process.env.secret);
   if(payload.type !== 'access') {
       res.status(401).json({message: "Invalid token 1"})
       return;
   }
  } catch (e) {
      if(e instanceof jwt.TokenExpiredError) {
          res.status(401).json({message:'Token expired!'})
      }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token!" });
      return;
    }
  }
  next();
};
