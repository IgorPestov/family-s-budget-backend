const express = require("express")
const user = express.Router()
const userController = require("../controllers/user")
const validate = require("../middleware/validate")

user.get("/show-user",validate, userController.showUser)

module.exports = user