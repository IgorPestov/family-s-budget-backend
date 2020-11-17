const budgetModel = require("../models/budgetShecma");
const userModel = require("../models/userSchem");
exports.addWaste = async (req, res) => {
  const { price, date, item } = req.body;
  const { id } = req.query;
  const user = await userModel.findOne({ _id: id });
  if (user.budget) {
    const waste = await budgetModel.findOneAndUpdate(
      { _id: user.budget },
      {
        $push: {
          waste: { price, date, item, userId: id },
        },
      },
      { returnOriginal: false }
    );
    res.send(waste);
  } else {
    const waste = new budgetModel({
      waste: { price, date, item, userId: id },
    });
    const userUpdate = await userModel.findOneAndUpdate(
      id,
      {
        budget: waste._id,
      },
      { returnOriginal: false }
    );
    res.send(userUpdate);
    waste.save((err, waste) => {
      if (err) {
        console.log(err);
      }
    });
  }
};
