const { Schema, model } = require("mongoose");

const budgetSchema = new Schema({
  waste: [
    {
      date: String,
      fullName: String,
      email: String,
      nameWaste: String,
      price: Number,
      userId: String
    },
  ],
});
const budgetModel = model("Budget", budgetSchema);

module.exports = budgetModel;
