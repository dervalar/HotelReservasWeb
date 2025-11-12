const apiUrl = "http://localhost:3000/api/personas";

async function cargarPersonas() {
  try {
    const response = await fetch(apiUrl);
    const personas = await response.json();

    const tabla = document.getElementById("tablaPersonas");
    tabla.innerHTML = "";

    personas.forEach(p => {
      const fila = `
        <tr>
          <td>${p.id}</td>
          <td>${p.nombre}</td>
          <td>${p.email}</td>
          <td>${p.telefono}</td>
          <td>${p.dni}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error al cargar personas:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarPersonas);
