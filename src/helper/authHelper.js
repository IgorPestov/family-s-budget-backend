const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const { tokens } = require("../config/configToken").jwt;

const tokenModel = require("../models/tokenSchema");
require("dotenv").config();

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const option = {
    expiresIn: tokens.access.expiresIn,
  };
  return jwt.sign(payload, process.env.secret, option);
};
const generateRefreshToken = () => {
  const payload = {
    id: randtoken.uid(256),
    type: tokens.refresh.type,
  };
  const option = {
    expiresIn: tokens.refresh.expiresIn,
  };
  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.secret, option),
  };
};
const generetRestartPassword = () => {
  const payload = {
    userId,
    type: tokens.restartPassword.type,
  };
  const option = {
    expiresIn: tokens.restartPassword.expiresIn,
  };
  return jwt.sign(payload, process.env.secret, option);
};
const replaceRefreshToken = (tokenId, userId) => 
  tokenModel
    .findOneAndRemove({userId})
    .exec()
    .then(() => tokenModel.create({ tokenId, userId }));
;
const updateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  return replaceRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
};
module.exports = {
  // generateRefreshToken,
  // generateAccessToken,
  generetRestartPassword,
  // replaceRefreshToken,
  updateTokens
};
