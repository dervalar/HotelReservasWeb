import express from "express";
import { db } from "../db.js";

const router = express.Router();

// =======================
//  GET: todas las reservas
// =======================
router.get("/", (req, res) => {
  db.query("SELECT * FROM reservas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =======================
//  POST: crear reserva
// =======================
router.post("/", (req, res) => {
  const { persona_id, habitacion_id, check_in, check_out } = req.body;

  if (!persona_id || !habitacion_id || !check_in || !check_out) {
    return res.status(400).json({ error: "Faltan datos para la reserva" });
  }

  // 1) Obtener precioBase de la habitación
  const sqlPrecio = "SELECT precioBase FROM habitaciones WHERE id = ?";

  db.query(sqlPrecio, [habitacion_id], (err, precioResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!precioResult.length) {
      return res.status(400).json({ error: "Habitación no encontrada" });
    }

    const precioBase = precioResult[0].precioBase;

    // 2) Calcular cantidad de noches
    const dIn = new Date(check_in);
    const dOut = new Date(check_out);

    const msDia = 1000 * 60 * 60 * 24;
    let dias = Math.ceil((dOut - dIn) / msDia);
    if (dias < 1) dias = 1; // al menos 1 noche

    const monto = dias * precioBase;

    // 3) Insertar reserva (incluyendo monto)
    const sqlInsert = `
      INSERT INTO reservas (habitacionId, personaId, checkIn, checkOut, monto, estado)
      VALUES (?, ?, ?, ?, ?, 'CONFIRMADA')
    `;

    db.query(
      sqlInsert,
      [habitacion_id, persona_id, check_in, check_out, monto],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Reserva creada", id: result.insertId });
      }
    );
  });
});

// =======================
//  PUT: editar reserva
// (todavía no la usás en el front, pero la dejamos lista)
// =======================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { persona_id, habitacion_id, check_in, check_out, estado } = req.body;

  if (!persona_id || !habitacion_id || !check_in || !check_out || !estado) {
    return res.status(400).json({ error: "Faltan datos para actualizar la reserva" });
  }

  const sqlPrecio = "SELECT precioBase FROM habitaciones WHERE id = ?";

  db.query(sqlPrecio, [habitacion_id], (err, precioResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!precioResult.length) {
      return res.status(400).json({ error: "Habitación no encontrada" });
    }

    const precioBase = precioResult[0].precioBase;

    const dIn = new Date(check_in);
    const dOut = new Date(check_out);
    const msDia = 1000 * 60 * 60 * 24;
    let dias = Math.ceil((dOut - dIn) / msDia);
    if (dias < 1) dias = 1;

    const monto = dias * precioBase;

    const sqlUpdate = `
      UPDATE reservas
      SET habitacionId = ?, personaId = ?, checkIn = ?, checkOut = ?, monto = ?, estado = ?
      WHERE id = ?
    `;

    db.query(
      sqlUpdate,
      [habitacion_id, persona_id, check_in, check_out, monto, estado, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Reserva actualizada" });
      }
    );
  });
});

// =======================
//  DELETE: eliminar reserva
// =======================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM reservas WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Reserva eliminada" });
  });
});

// 👈 ESTA LÍNEA ES LA QUE FALTABA
export default router;
