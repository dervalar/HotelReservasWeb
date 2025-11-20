// frontend/scripts/habitaciones.js

const API_URL = "http://localhost:3000/api";

let editandoHab = false;
let idEditandoHab = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarHabitaciones();

  const form = document.getElementById("form-habitacion");
  form.addEventListener("submit", manejarSubmitHabitacion);
});


// SUBMIT (crear / editar)

async function manejarSubmitHabitacion(e) {
  e.preventDefault();

  const numero = document.getElementById("habNumero").value;
  const tipo = document.getElementById("habTipo").value;
  const capacidad = document.getElementById("habCapacidad").value;
  const precioBase = document.getElementById("habPrecio").value;
  const estado = document.getElementById("habEstado").value;

  if (!numero || !tipo || !capacidad || !precioBase || !estado) {
    alert("Completá todos los campos de la habitación");
    return;
  }

  const habitacion = {
    numero,
    tipo,
    capacidad: Number(capacidad),
    precioBase: Number(precioBase),
    estado,
  };

  try {
    let resp;

    if (editandoHab && idEditandoHab != null) {
      // EDITAR
      resp = await fetch(`${API_URL}/habitaciones/${idEditandoHab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitacion),
      });
    } else {
      // CREAR
      resp = await fetch(`${API_URL}/habitaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitacion),
      });
    }

    
    let data = null;
    try {
      data = await resp.json();
    } catch (err) {
      
    }

    if (!resp.ok) {
      const msg = data?.error || "No se pudo guardar la habitación";
      alert(msg);
      return;
    }

    // Reseteo de formulario y estado de edición
    e.target.reset();
    editandoHab = false;
    idEditandoHab = null;
    const pStatus = document.getElementById("form-status");
    if (pStatus) pStatus.textContent = "";

    await cargarHabitaciones();
  } catch (err) {
    console.error(err);
    alert("No se pudo guardar la habitación (error de red)");
  }
}

// CARGAR LISTA

async function cargarHabitaciones() {
  try {
    const resp = await fetch(`${API_URL}/habitaciones`);
    const habitaciones = await resp.json();

    const tbody = document.getElementById("tablaHabitaciones");
    tbody.innerHTML = "";

    habitaciones.forEach((h) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${h.id}</td>
        <td>${h.numero}</td>
        <td>${h.tipo}</td>
        <td>${h.capacidad}</td>
        <td>${h.precioBase}</td>
        <td>${h.estado}</td>
        <td class="acciones">
          <button class="btn-edit" onclick="editarHabitacion(${h.id}, '${h.numero}', '${h.tipo}', ${h.capacidad}, ${h.precioBase}, '${h.estado}')">✏️</button>
          <button class="btn-delete" onclick="eliminarHabitacion(${h.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar las habitaciones");
  }
}


// EDITAR (carga el formulario)

function editarHabitacion(id, numero, tipo, capacidad, precioBase, estado) {
  document.getElementById("habNumero").value = numero;
  document.getElementById("habTipo").value = tipo;
  document.getElementById("habCapacidad").value = capacidad;
  document.getElementById("habPrecio").value = precioBase;
  document.getElementById("habEstado").value = estado;

  editandoHab = true;
  idEditandoHab = id;

  const pStatus = document.getElementById("form-status");
  if (pStatus) pStatus.textContent = `EDITANDO habitación ID ${id} - Guardar para aplicar cambios`;
}


// ELIMINAR

async function eliminarHabitacion(id) {
  if (!confirm("¿Eliminar habitación?")) return;

  try {
    const resp = await fetch(`${API_URL}/habitaciones/${id}`, {
      method: "DELETE",
    });

    if (!resp.ok) {
      alert("No se pudo eliminar la habitación");
      return;
    }

    await cargarHabitaciones();
  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar la habitación");
  }
}
