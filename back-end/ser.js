const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

app.use(cors());
app.use(express.json());


app.get("/api/expenses", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, title, amount, category, TO_CHAR(date, 'DD-MM-YYYY') AS date FROM expenses ORDER BY id ASC"
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("GET ALL ERROR:", err.message);
        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
});


app.get("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            "SELECT id, title, amount, category, TO_CHAR(date, 'DD-MM-YYYY') AS date FROM expenses WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("GET ONE ERROR:", err.message);
        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
});


app.post("/api/expenses", async (req, res) => {
    const { title, amount, category } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: "Amount must be a number greater than 0" });
    }

    const selectedCategory = category || "Other";
    if (!ALLOWED_CATEGORIES.includes(selectedCategory)) {
        return res.status(400).json({ 
            error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` 
        });
    }

    try {
        const queryText = `
            INSERT INTO expenses (title, amount, category, date)
            VALUES ($1, $2, $3, CURRENT_DATE)
            RETURNING id, title, amount, category, TO_CHAR(date, 'DD-MM-YYYY') AS date
        `;
        const result = await db.query(queryText, [title, parsedAmount, selectedCategory]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST ERROR:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});


app.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: "Amount must be a number greater than 0" });
    }

    const selectedCategory = category || "Other";
    if (!ALLOWED_CATEGORIES.includes(selectedCategory)) {
        return res.status(400).json({ 
            error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}` 
        });
    }

    try {
        const queryText = `
            UPDATE expenses
            SET title = $1, amount = $2, category = $3
            WHERE id = $4
            RETURNING id, title, amount, category, TO_CHAR(date, 'DD-MM-YYYY') AS date
        `;
        const result = await db.query(queryText, [title, parsedAmount, selectedCategory, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("PUT ERROR:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});


app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM expenses WHERE id = $1 RETURNING id, title, amount, category, TO_CHAR(date, 'DD-MM-YYYY') AS date",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            deleted: result.rows[0]
        });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});