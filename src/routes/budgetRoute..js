const express = require("express")
const budget = express.Router()
const budgetControllers = require("../controllers/budget")
budget.post("/add-waste", budgetControllers.addWaste)
budget.put("/edit-waste", budgetControllers.editWaste)
budget.delete("/delete-waste", budgetControllers.deleteWaste)

module.exports = budget