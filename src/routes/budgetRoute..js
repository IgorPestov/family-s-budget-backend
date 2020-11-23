const express = require("express")
const budget = express.Router()
const budgetControllers = require("../controllers/budget")
const validate = require("../middleware/validate")
budget.post("/add-waste",validate, budgetControllers.addWaste)
budget.put("/edit-waste",validate, budgetControllers.editWaste)
budget.delete("/delete-waste",validate, budgetControllers.deleteWaste)

module.exports = budget