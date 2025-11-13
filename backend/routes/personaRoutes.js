// backend/routes/personaRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// =============================
// GET – Todas las personas
// =============================
router.get("/", (req, res) => {
    db.query("SELECT * FROM personas", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// =============================
// POST – Crear persona
// =============================
router.post("/", (req, res) => {
    const { dni, nombre, email, telefono } = req.body;

    if (!dni || !nombre) {
        return res.status(400).json({ error: "DNI y nombre son obligatorios" });
    }

    const sql = `
        INSERT INTO personas (dni, nombre, email, telefono)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [dni, nombre, email, telefono], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ mensaje: "Persona creada", id: result.insertId });
    });
});

// =============================
// PUT – Editar persona
// =============================
router.put("/:id", (req, res) => {
    const { dni, nombre, email, telefono } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE personas
        SET dni=?, nombre=?, email=?, telefono=?
        WHERE id=?
    `;

    db.query(sql, [dni, nombre, email, telefono, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ mensaje: "Persona actualizada" });
    });
});

// =============================
// DELETE – Eliminar persona
// =============================
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM personas WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Persona eliminada" });
    });
});

export default router;
