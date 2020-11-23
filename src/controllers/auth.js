const userModel = require("../models/userSchem");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/authHelper");
const { json } = require("body-parser");
const tokenModel = require("../models/tokenSchema");

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.secret);
    if (payload.type !== "refresh") {
      res.status(400).jason({ message: "Неверный токен" });
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(400),
        json({
          message: "Время токена истекло",
        });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Неверный токен" });
    }
  }
  tokenModel
    .findOne({ tokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error("Неверный токен");
      }
      return authHelper.updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json({ message: err.message }));
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email, password });
    if (!user) {
      res.status(400).json({
        message: "Invalid e-mail or password",
      });
    } else {
      authHelper.updateTokens(user._id).then((tokens) => res.json(tokens));
    }
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "email already exist",
      });
    }
    const user = new userModel({
      email,
      password,
      fullName,
    });
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }
    });
    res.json({ redirect: true });
  } catch (err) {
    res.send(400).json({
      message: err,
    });
  }
};
exports.checkEmailForResetPasword = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUser = await userModel.findOne({ email });
    res.send(checkUser.id);
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
exports.resetPassword = async (req, res) => {
  const { userId } = req.query;
  const { password } = req.body;
  try {
    await userModel.findByIdAndUpdate({ userId }, { password });
    res.send(true);
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
