const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/authRoute.");
const budget = require("./routes/budgetRoute.")
const user = require("./routes/userRoute")
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DatabaseChat is connected successfully");
  })
  .catch((err) => {
    console.log("Error with connecting to database",err);
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/auth", auth);
app.use("/budget", budget);
app.use("/user", user)
app.listen(PORT, () => {
  console.log(`server listen port ${PORT}...`);
});
