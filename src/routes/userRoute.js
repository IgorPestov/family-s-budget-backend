const express = require("express")
const user = express.Router()
const userController = require("../controllers/user")
const validate = require("../middleware/validate")
const { use } = require("./budgetRoute.")

user.get("/show-user",validate, userController.showUser)
user.post("/request-in-family", userController.requestInFamily)
user.post("/confirmation-to-family", userController.confirmationUserToFamily)
module.exports = user