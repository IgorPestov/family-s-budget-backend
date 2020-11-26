const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String },
  password: { type: String, select: false },
  fullName: { type: String },
  budget: { type: String },
  admin: { type: Boolean, default:false },
});
const userModel = model("User", userSchema);
module.exports = userModel;
