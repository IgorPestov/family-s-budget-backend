const userModel = require("../models/userSchem");
const budgetModel = require("../models/budgetShecma");
const { use } = require("../routes/userRoute");

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
  const userRequestInFamily = await userModel.findOne({_id:userId})
   if(userRequestInFamily.request.length > 0) {
     
   }
  const userUpdate = await userModel.findOneAndUpdate(
    { _id: userId, admin: false, "request.budgetId": { $ne: budgetId } },
    {
      $addToSet: {
        request: {
          budgetId,
        },
      },
    },
    { returnOriginal: false }
  );
  console.log(userRequestInFamily)
   await userModel.findOneAndUpdate(
    { budget: budgetId, admin: true, "request.userId": { $ne: userId } },
    {
      $addToSet: {
        request: {
          fullName: userRequestInFamily.fullName,
          userId,
        },
      },
    },
    { returnOriginal: false }
  );

  res.send(userUpdate);
};
