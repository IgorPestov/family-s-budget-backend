const userModel = require("../models/userSchem");
const budgetModel = require("../models/budgetShecma")
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email, password });
    if (!user) {
      res.status(400).json({
        message: "Invalid e-mail or password",
      });
    }
    else {
        res.send(user)
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
    res.send(user);
  } catch (err) {
    res.send(400).json({
      message: err,
    });
  }
};
