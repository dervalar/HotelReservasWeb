import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root88',
  database: 'hotel'
});

db.connect(err => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
    return;
  }
  console.log("✅ Conectado correctamente a la base de datos hotel");
});
