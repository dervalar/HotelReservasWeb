// backend/routes/personaRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// ===============================
// GET - Todas las personas
// ===============================
router.get("/", (req, res) => {
  db.query("SELECT * FROM personas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ===============================
// POST - Crear persona
// ===============================
router.post("/", (req, res) => {
  const { dni, nombre, email, telefono } = req.body;

  if (!dni || !nombre) {
    return res
      .status(400)
      .json({ error: "DNI y nombre son obligatorios para la persona" });
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

// ===============================
// PUT - Editar persona
// ===============================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { dni, nombre, email, telefono } = req.body;

  if (!dni || !nombre) {
    return res
      .status(400)
      .json({ error: "DNI y nombre son obligatorios para la persona" });
  }

  const sql = `
    UPDATE personas
    SET dni = ?, nombre = ?, email = ?, telefono = ?
    WHERE id = ?
  `;

  db.query(sql, [dni, nombre, email, telefono, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ mensaje: "Persona actualizada" });
  });
});

// ===============================
// DELETE - Eliminar persona
// ===============================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM personas WHERE id = ?", [id], (err, result) => {
    if (err) {
      // Esto es lo que te está pasando con las personas viejas:
      // si tienen reservas asociadas, MySQL tira error de FK.
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          error:
            "No se puede eliminar la persona porque tiene reservas asociadas.",
        });
      }
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json({ mensaje: "Persona eliminada" });
  });
});

export default router;
