const userModel = require("../models/userSchem");
const budgetModel = require("../models/budgetShecma");

exports.showUser = async (req, res) => {
  const { userId } = req.query;
  const user = await userModel.findById(userId);
  if (user.budget) {
    const budget = await budgetModel.findById(user.budget);
    res.json({ user, budget });
  } else res.json({ user });
};
exports.requestInFamily = async(req, res) => {
  const {familyName , email} =req.body
  // const 
}