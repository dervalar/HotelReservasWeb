// backend/routes/habitacionRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// ===============================
// GET - Todas las habitaciones
// ===============================
router.get("/", (req, res) => {
  db.query("SELECT * FROM habitaciones", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ===============================
// POST - Crear habitación
// ===============================
router.post("/", (req, res) => {
  const { numero, tipo, capacidad, precioBase, estado } = req.body;

  if (!numero || !tipo || !capacidad || !precioBase || !estado) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para la habitación" });
  }

  const sql = `
    INSERT INTO habitaciones (numero, tipo, capacidad, precioBase, estado)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [numero, tipo, capacidad, precioBase, estado],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({ mensaje: "Habitación creada", id: result.insertId });

    }
  );
});

// ===============================
// PUT - Editar habitación
// ===============================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { numero, tipo, capacidad, precioBase, estado } = req.body;

  if (!numero || !tipo || !capacidad || !precioBase || !estado) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para la habitación" });
  }

  const sql = `
    UPDATE habitaciones
    SET numero = ?, tipo = ?, capacidad = ?, precioBase = ?, estado = ?
    WHERE id = ?
  `;

  db.query(sql, [numero, tipo, capacidad, precioBase, estado, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ mensaje: "Habitación actualizada" });

  });
});

// ===============================
// DELETE - Eliminar habitación
// ===============================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM habitaciones WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Habitación no encontrada" });
    }

    res.json({ mensaje: "Habitación eliminada" });
  });
});

export default router;
