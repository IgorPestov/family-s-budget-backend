const express = require("express")
const user = express.Router()
const userController = require("../controllers/user")

user.get("/show-user", userController.showUser)

module.exports = user