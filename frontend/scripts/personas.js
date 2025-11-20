// frontend/scripts/personas.js
const API_URL = "http://localhost:3000/api";

let editandoPers = false;
let idEditandoPers = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-persona");
  cargarPersonas();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dni = document.getElementById("perDni").value;
    const nombre = document.getElementById("perNombre").value;
    const email = document.getElementById("perEmail").value;
    const telefono = document.getElementById("perTelefono").value;

    const persona = { dni, nombre, email, telefono };

    try {
      let url = `${API_URL}/personas`;
      let method = "POST";

      if (editandoPers && idEditandoPers != null) {
        url = `${API_URL}/personas/${idEditandoPers}`;
        method = "PUT";
      }

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        console.error("Error al guardar persona:", data);
        alert(data?.error || "No se pudo guardar la persona");
        return;
      }

      form.reset();
      editandoPers = false;
      idEditandoPers = null;
      document.getElementById("form-status").textContent = "";

      await cargarPersonas();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la persona (error de red)");
    }
  });
});


// Cargar tabla de personas

async function cargarPersonas() {
  try {
    const resp = await fetch(`${API_URL}/personas`);
    const personas = await resp.json();

    const tbody = document.getElementById("tablaPersonas");
    tbody.innerHTML = "";

    personas.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.dni}</td>
        <td>${p.nombre}</td>
        <td>${p.email || ""}</td>
        <td>${p.telefono || ""}</td>
        <td class="acciones">
          <button class="btn-edit" onclick="editarPersona(${p.id}, '${p.dni}', '${p.nombre}', '${p.email || ""}', '${p.telefono || ""}')">✏️</button>
          <button class="btn-delete" onclick="eliminarPersona(${p.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar las personas");
  }
}


// EDITAR

function editarPersona(id, dni, nombre, email, telefono) {
  document.getElementById("perDni").value = dni;
  document.getElementById("perNombre").value = nombre;
  document.getElementById("perEmail").value = email;
  document.getElementById("perTelefono").value = telefono;

  editandoPers = true;
  idEditandoPers = id;

  document.getElementById("form-status").textContent =
    `EDITANDO persona ID ${id} - Guardar para aplicar cambios`;
}


// ELIMINAR

async function eliminarPersona(id) {
  if (!confirm("¿Eliminar persona?")) return;

  try {
    const resp = await fetch(`${API_URL}/personas/${id}`, {
      method: "DELETE",
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      alert(
        data?.error ||
          "No se pudo eliminar la persona (puede tener reservas asociadas)"
      );
      return;
    }

    await cargarPersonas();
  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar la persona");
  }
}
