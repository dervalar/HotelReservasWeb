const apiUrl = "http://localhost:3000/api/reservas";

async function cargarReservas() {
  try {
    const response = await fetch(apiUrl);
    const reservas = await response.json();

    const tabla = document.getElementById("tablaReservas");
    tabla.innerHTML = "";

    reservas.forEach(r => {
      const fila = `
        <tr>
          <td>${r.id}</td>
          <td>${r.habitacion_id}</td>
          <td>${r.persona_id}</td>
          <td>${new Date(r.check_in).toLocaleDateString()}</td>
          <td>${new Date(r.check_out).toLocaleDateString()}</td>
          <td>$${r.monto}</td>
          <td>${r.estado}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarReservas);
