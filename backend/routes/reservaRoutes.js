// backend/routes/reservaRoutes.js
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// =============================
// GET – Todas las reservas
// =============================
router.get("/", (req, res) => {
    db.query("SELECT * FROM reservas", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// =============================
// POST – Crear reserva
// =============================
router.post("/", (req, res) => {
    const { habitacion_id, persona_id, check_in, check_out } = req.body;

    if (!habitacion_id || !persona_id || !check_in || !check_out) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Calcular días
    const dias = (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);

    if (dias <= 0) {
        return res.status(400).json({ error: "Las fechas no son válidas" });
    }

    // Obtener precio base de la habitación
    db.query(
        "SELECT precioBase FROM habitaciones WHERE id=?",
        [habitacion_id],
        (err, habResult) => {
            if (err || habResult.length === 0)
                return res.status(500).json({ error: "Habitación no encontrada" });

            const precioBase = habResult[0].precioBase;
            const monto = precioBase * dias;

            const sql = `
                INSERT INTO reservas (habitacionId, personaId, checkIn, checkOut, monto, estado)
                VALUES (?, ?, ?, ?, ?, 'CONFIRMADA')
            `;

            db.query(
                sql,
                [habitacion_id, persona_id, check_in, check_out, monto],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ mensaje: "Reserva creada", id: result.insertId });
                }
            );
        }
    );
});

// =============================
// PUT – Editar reserva
// =============================
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { habitacion_id, persona_id, check_in, check_out, estado } = req.body;

    const sql = `
        UPDATE reservas
        SET habitacionId=?, personaId=?, checkIn=?, checkOut=?, estado=?
        WHERE id=?
    `;

    db.query(
        sql,
        [habitacion_id, persona_id, check_in, check_out, estado, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Reserva actualizada" });
        }
    );
});

// =============================
// DELETE – Eliminar reserva
// =============================
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM reservas WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ mensaje: "Reserva eliminada" });
    });
});

export default router;
