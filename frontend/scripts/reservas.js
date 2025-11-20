// frontend/scripts/reservas.js

const API_URL = "http://localhost:3000/api";

let editandoRes = false;
let idEditandoRes = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarCombos();
  cargarReservas();

  const form = document.getElementById("form-reserva");
  form.addEventListener("submit", manejarSubmitReserva);
});


// SUBMIT (crear / editar reserva)

async function manejarSubmitReserva(e) {
  e.preventDefault();

  const personaId    = document.getElementById("resPersona").value;
  const habitacionId = document.getElementById("resHabitacion").value;
  const checkIn      = document.getElementById("resCheckIn").value;
  const checkOut     = document.getElementById("resCheckOut").value;

  if (!personaId || !habitacionId || !checkIn || !checkOut) {
    alert("Completá todos los datos de la reserva");
    return;
  }

  const reserva = {
    personaId,
    habitacionId,
    checkIn,
    checkOut,
    monto: 0,
    estado: "CONFIRMADA"
  };

  try {
    let resp;

    if (editandoRes && idEditandoRes != null) {
      // EDITAR
      resp = await fetch(`${API_URL}/reservas/${idEditandoRes}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });
    } else {
      // CREAR
      resp = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });
    }

    let data = null;
    try { data = await resp.json(); } catch (err) {}

    if (!resp.ok) {
      const msg = data?.error || "No se pudo guardar la reserva";
      alert(msg);
      return;
    }

    e.target.reset();
    editandoRes = false;
    idEditandoRes = null;

    const pStatus = document.getElementById("form-status");
    if (pStatus) pStatus.textContent = "";

    await cargarReservas();
  } catch (err) {
    console.error(err);
    alert("No se pudo guardar la reserva (error de red)");
  }
}


// CARGAR COMBOS (personas y habitaciones)

async function cargarCombos() {
  try {
    const [respPers, respHab] = await Promise.all([
      fetch(`${API_URL}/personas`),
      fetch(`${API_URL}/habitaciones`),
    ]);

    const personas = await respPers.json();
    const habitaciones = await respHab.json();

    const selPers = document.getElementById("resPersona");
    const selHab = document.getElementById("resHabitacion");

    selPers.innerHTML = "";
    selHab.innerHTML = "";

    personas.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.dni} - ${p.nombre}`;
      selPers.appendChild(opt);
    });

    habitaciones.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h.id;
      opt.textContent = `${h.numero} (${h.estado})`;
      selHab.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar personas / habitaciones");
  }
}


// CARGAR LISTA DE RESERVAS

async function cargarReservas() {
  try {
    const resp = await fetch(`${API_URL}/reservas`);
    const reservas = await resp.json();

    const tbody = document.getElementById("tablaReservas");
    tbody.innerHTML = "";

    reservas.forEach((r) => {
      const tr = document.createElement("tr");
      const checkIn  = r.checkIn  ? r.checkIn.substring(0, 10)  : "";
      const checkOut = r.checkOut ? r.checkOut.substring(0, 10) : "";

      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.habitacionId}</td>
        <td>${r.personaId}</td>
        <td>${checkIn}</td>
        <td>${checkOut}</td>
        <td>${r.monto}</td>
        <td>${r.estado}</td>
        <td class="acciones">
          <button class="btn-edit"
            onclick="editarReserva(${r.id}, ${r.personaId}, ${r.habitacionId},
              '${checkIn}', '${checkOut}', '${r.estado}')">✏️</button>
          <button class="btn-delete" onclick="eliminarReserva(${r.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar las reservas");
  }
}


// EDITAR (carga el formulario)

function editarReserva(id, personaId, habitacionId, checkIn, checkOut, estado) {
  document.getElementById("resPersona").value    = personaId;
  document.getElementById("resHabitacion").value = habitacionId;
  document.getElementById("resCheckIn").value    = checkIn;
  document.getElementById("resCheckOut").value   = checkOut;

  editandoRes = true;
  idEditandoRes = id;

  const pStatus = document.getElementById("form-status");
  if (pStatus) {
    pStatus.textContent = `EDITANDO reserva ID ${id} - Guardar para aplicar cambios`;
  }
}


// ELIMINAR

async function eliminarReserva(id) {
  if (!confirm("¿Eliminar reserva?")) return;

  try {
    const resp = await fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
    });

    if (!resp.ok) {
      alert("No se pudo eliminar la reserva");
      return;
    }

    await cargarReservas();
  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar la reserva");
  }
}
