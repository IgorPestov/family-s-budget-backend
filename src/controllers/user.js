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
  const userRequestInFamily = await userModel.findOne({ _id: userId });
  const budget = await budgetModel.findOne({ _id: budgetId });

  if (
    userRequestInFamily.request.length > 0 &&
    userRequestInFamily.request[0].familyName === budget.familyName
  ) {
    res.status(400).json({ message: "Вы уже отправили этой семье запорос" });
  } else {
    await userModel.findOneAndUpdate(
      { "request.userId": userId },
      {
        $pull: {
          request: {
            userId,
          },
        },
      }
    );
    userUpdate = await userModel.findOneAndUpdate(
      { _id: userId, admin: false },
      {
        request: {
          familyName: budget.familyName,
        },
      },

      { returnOriginal: false }
    );

    console.log(userRequestInFamily);
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
  }
};
exports.confirmationUserToFamily = async (req, res) => {
  const { userId, isJoin, adminId, budgetId } = req.body;
  let admin;
  if (isJoin === "true") {
    await userModel.findOneAndUpdate({ _id: userId }, { budget: budgetId });
    admin = await userModel.findOneAndUpdate(
      { _id: adminId },
      { $pull: { request: { userId } } },
      { returnOriginal: false }
    );
  } else {
    await userModel.findOneAndUpdate({ _id: userId }, { request: [] });
    admin = await userModel.findOneAndUpdate(
      { _id: adminId },
      { $pull: { request: { userId } } },
      { returnOriginal: false }
    );
  }
  res.send(admin);
};
