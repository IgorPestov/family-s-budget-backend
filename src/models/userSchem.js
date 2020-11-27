const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String },
  password: { type: String, select: false },
  fullName: { type: String },
  budget: { type: String },
  admin: { type: Boolean, default: false },
  request: [
    {
      fullName: { type:String},
      userId: { type: Object, unique: true },
      budgetId: {type:String,unique: true }
    },
  ],
});
const userModel = model("User", userSchema);
module.exports = userModel;
