import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener todas las reservas
router.get("/", (req, res) => {
    db.query("SELECT * FROM reservas", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

export default router;
