const express = require("express")
const budget = express.Router()
const budgetControllers = require("../controllers/budget")
budget.post("/add-waste", budgetControllers.addWaste)

module.exports = budget