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
exports.requestInFamily = async (req, res) => {
  const { userId, budgetId } = req.body;
  const userRequestInFamily = await userModel.findOne({ _id: userId });
  const userAdmin = await userModel.findOneAndUpdate(
    { budget: budgetId, admin: true },
    {
      $push: {
        request: {
          fullName: userRequestInFamily.fullName,
          userId: userRequestInFamily._id,
        },
      },
    },
    { returnOriginal: false }
  );
  
 res.send(userAdmin)
};
