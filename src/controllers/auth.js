const userModel = require("../models/userSchem");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/authHelper");
const { json } = require("body-parser");
const tokenModel = require("../models/tokenSchema");
const mailGun = require("nodemailer-mailgun-transport");
const nodemailer = require("nodemailer");
require("dotenv").config();
//////////////// TOKEN
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.secret);
    if (payload.type !== "refresh") {
      res.status(400).jason({ message: "Invalid token!"});
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(400),
        json({
          message: "Token expired!",
        });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: "Invalid token!" });
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
//////////////// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email, password });
    if (!user) {
      res.status(400).json({
        message: "Неверная почти или пароль",
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
//////////////// SIGNUP
exports.signup = async (req, res) => {
  const { email, password, fullName, budgetId } = req.body;
  try {
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "email already exist",
      });
    }
    let user;
    if (budgetId) {
       user = new userModel({
        email,
        password,
        fullName,
        budget: budgetId,
      });
    } else {
       user = new userModel({
        email,
        password,
        fullName,
      });
    }
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
//////////////// CHECK MAIL FOR RESET PASSWORD
exports.checkEmailForResetPasword = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUser = await userModel.findOne({ email });
    res.send(checkUser.id);
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
//////////////// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { userId } = req.query;
  const { password } = req.body;
  try {
    await userModel.findByIdAndUpdate({ _id: userId }, { password });
    res.send(true);
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
//////////////// INVITE USER IN GROUP
exports.inviteNewUser = async (req, res) => {
  const { budgetId, email } = req.body;
  const isUserCheck = await userModel.findOne({ email });
  if (isUserCheck && isUserCheck.budget) {
    res.status(400).json({
      message:
        "Прости, у него уже есть семья... Тебе нужен кто-то другой, просто ищи дальше и не опускай руки...",
    });
  } else {
    const auth = {
      auth: {
        api_key: process.env.API_KEY,
        domain: process.env.DOMAIN,
      },
    };
    const transporter = nodemailer.createTransport(mailGun(auth));
    const mailOptions = {
      from: "support-user@gmail.com",
      to: email,
      subject: "Recovery account",
      html: `
     <h1>Нажми на неё </h1>
     <a href="https://budget-family.herokuapp.com/signup?budgetId=${budgetId}" > Да-да, именно на меня </a> 
     `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ error: err.message });
      }
    });
    res.json({ message: "Ок, я его позову. Тяю-тяю-тяю-тяю" });
  }
};
