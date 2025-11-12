import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./db.js";

// Importar rutas
import habitacionRoutes from "./routes/habitacionRoutes.js";
import personaRoutes from "./routes/personaRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";

// Inicializar la app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas principales
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/reservas", reservaRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Servidor HotelReservasWeb corriendo correctamente");
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
