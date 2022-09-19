const { default: mongoose } = require("mongoose");

// IncomeCategory, ExpenseCategory
const categorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = categorySchema