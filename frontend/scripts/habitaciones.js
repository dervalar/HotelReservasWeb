const apiUrl = "http://localhost:3000/api/habitaciones";

async function cargarHabitaciones() {
  try {
    const response = await fetch(apiUrl);
    const habitaciones = await response.json();

    const tabla = document.getElementById("tablaHabitaciones");
    tabla.innerHTML = "";

    habitaciones.forEach(h => {
      const fila = `
        <tr>
          <td>${h.id}</td>
          <td>${h.numero}</td>
          <td>${h.tipo}</td>
          <td>${h.capacidad}</td>
          <td>${h.precio_base}</td>
          <td>${h.estado}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error al cargar habitaciones:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarHabitaciones);
