const { Schema, model } = require("mongoose");

const budgetSchema = new Schema({
  waste: [
    {
      date: String,
      item: String,
      price: String,
      userId: String
    },
  ],
});
const budgetModel = model("Budget", budgetSchema);

module.exports = budgetModel;
