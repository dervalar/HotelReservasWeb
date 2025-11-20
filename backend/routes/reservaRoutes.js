// backend/routes/reservaRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();


// GET - Todas las reservas

router.get("/", (req, res) => {
  const sql = `
    SELECT
      r.id,
      r.habitacionId,
      r.personaId,
      r.checkIn,
      r.checkOut,
      r.monto,
      r.estado,
      p.nombre      AS personaNombre,
      p.dni         AS personaDni,
      h.numero      AS habNumero,
      h.tipo        AS habTipo,
      h.estado      AS habEstado
    FROM reservas r
    JOIN personas   p ON r.personaId   = p.id
    JOIN habitaciones h ON r.habitacionId = h.id
    ORDER BY r.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Función para calcular monto
function calcularMonto(checkIn, checkOut, precioBase) {
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const msDia = 1000 * 60 * 60 * 24;
  let dias = Math.ceil((dOut - dIn) / msDia);
  if (dias < 1) dias = 1;
  return dias * precioBase;
}


// POST - Crear reserva

router.post("/", (req, res) => {
  const { personaId, habitacionId, checkIn, checkOut } = req.body;

  if (!personaId || !habitacionId || !checkIn || !checkOut) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para la reserva" });
  }

  // 1) obtener precioBase de la habitación
  db.query(
    "SELECT precioBase FROM habitaciones WHERE id = ?",
    [habitacionId],
    (err, habRows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!habRows.length) {
        return res.status(400).json({ error: "Habitación no encontrada" });
      }

      const precioBase = habRows[0].precioBase;
      const monto = calcularMonto(checkIn, checkOut, precioBase);

      const sqlInsert = `
        INSERT INTO reservas (habitacionId, personaId, checkIn, checkOut, monto, estado)
        VALUES (?, ?, ?, ?, ?, 'CONFIRMADA')
      `;

      db.query(
        sqlInsert,
        [habitacionId, personaId, checkIn, checkOut, monto],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ mensaje: "Reserva creada", id: result.insertId });
        }
      );
    }
  );
});


// PUT - Editar reserva

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { personaId, habitacionId, checkIn, checkOut, estado } = req.body;

  if (!personaId || !habitacionId || !checkIn || !checkOut || !estado) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para actualizar la reserva" });
  }

  
  db.query(
    "SELECT precioBase FROM habitaciones WHERE id = ?",
    [habitacionId],
    (err, habRows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!habRows.length) {
        return res.status(400).json({ error: "Habitación no encontrada" });
      }

      const precioBase = habRows[0].precioBase;
      const monto = calcularMonto(checkIn, checkOut, precioBase);

      const sqlUpdate = `
        UPDATE reservas
        SET habitacionId = ?, personaId = ?, checkIn = ?, checkOut = ?, monto = ?, estado = ?
        WHERE id = ?
      `;

      db.query(
        sqlUpdate,
        [habitacionId, personaId, checkIn, checkOut, monto, estado, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ mensaje: "Reserva actualizada" });
        }
      );
    }
  );
});


// DELETE - Eliminar reserva

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM reservas WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json({ mensaje: "Reserva eliminada" });
  });
});

export default router;
