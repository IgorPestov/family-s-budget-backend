const budgetModel = require("../models/budgetShecma");
const userModel = require("../models/userSchem");
const budget = require("../routes/budgetRoute.");

///////// ADD WASTE
exports.addWaste = async (req, res) => {
  const { price, date, nameWaste, familyName } = req.body;
  const { userId } = req.query;
  try {
    const user = await userModel.findById(userId);
    if (user.budget) {
      const waste = await budgetModel.findByIdAndUpdate(
        user.budget,
        {
          $push: {
            waste: {
              price,
              date,
              nameWaste,
              userId,
              email: user.email,
              fullName: user.fullName,
            },
          },
        },
        { returnOriginal: false }
      );
      res.send(waste);
    } else {
      const checkName = await budgetModel.findOne({ familyName });
      if (!checkName) {
        const waste = new budgetModel({
          waste: {
            price,
            date,
            nameWaste,
            userId,
            fullName: user.fullName,
            email: user.email,
          },
          familyName,
        });
        await userModel.findByIdAndUpdate(
          userId,
          { admin: true, budget: waste._id, request: []},
          { returnOriginal: false }
        );
        res.send(waste);
        waste.save((err, waste) => {
          if (err) {
            res.status(400).json({ message: err });
          }
        });
      } else {
        res.status(400).json({message: "Такая семья уже есть"})
      }
    }
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
///////// EDIT WASTE
exports.editWaste = async (req, res) => {
  const { price, nameWaste, date, wasteId } = req.body;
  const { budgetId } = req.query;
  try {
    await budgetModel.updateOne(
      { "waste._id": wasteId },
      {
        $set: {
          "waste.$.price": price,
          "waste.$.nameWaste": nameWaste,
          "waste.$.date": date,
        },
      },
      { multi: true }
    );
    const budgetUpdate = await budgetModel.findById(budgetId);
    res.send(budgetUpdate);
  } catch (err) {
    res.status(400).json({
      message: "Ошибка редактирование. Пожалуйста пропробуйте снова.",
    });
  }
};
//////// DELETE WASTE
exports.deleteWaste = async (req, res) => {
  const { ids } = req.body;
  const { budgetId } = req.query;
  try {
    await budgetModel.updateOne(
      { _id: budgetId },
      { $pull: { waste: { _id: { $in: ids } } } }
    );
    const updateBudget = await budgetModel.findById(budgetId);
    res.send(updateBudget);
  } catch (err) {
    res.status(400).json({
      message: "Ошибка удаления. Пожалуйста поробуйте снова.",
    });
  }
};
exports.showAllBudget = async (req, res) => {
  const allBudget = await budgetModel.find({}, { waste: 0 });
  res.send(allBudget);
};
