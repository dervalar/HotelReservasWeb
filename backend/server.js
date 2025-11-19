import express from "express";
import cors from "cors";

// Importar rutas
import habitacionRoutes from "./routes/habitacionRoutes.js";
import personaRoutes from "./routes/personaRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";

// Inicializar app
const app = express();

// Middlewares
app.use(cors());

// 🔥 ESTA ES LA LÍNEA CLAVE
// Reemplaza bodyParser por el parser nativo de Express
app.use(express.json()); 

// Rutas principales
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/reservas", reservaRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor HotelReservasWeb corriendo correctamente");
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
