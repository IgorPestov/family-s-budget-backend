const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/auth");
const budget = require("./routes/budget")
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
    console.log("Error with connecting to database");
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", auth);
app.use("/budget", budget);

app.listen(3000, () => {
  console.log("server listen port 3000...");
});
