const API_URL = "http://localhost:3000/api";

let editando = false;
let idEditando = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarHabitaciones();

    const form = document.getElementById("formHabitacion");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const habitacion = {
            numero: document.getElementById("habNumero").value,
            tipo: document.getElementById("habTipo").value,
            capacidad: parseInt(document.getElementById("habCapacidad").value),
            precioBase: parseFloat(document.getElementById("habPrecio").value),
            estado: document.getElementById("habEstado").value
        };

        try {
            let resp;

            // EDITAR
            if (editando) {
                resp = await fetch(`${API_URL}/habitaciones/${idEditando}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(habitacion)
                });
            } else {
                // CREAR
                resp = await fetch(`${API_URL}/habitaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(habitacion)
                });
            }

            if (!resp.ok) throw new Error("Error al guardar habitación");

            form.reset();
            document.getElementById("habEstado").value = "DISPONIBLE";

            editando = false;
            idEditando = null;
            document.getElementById("form-status").textContent = "";

            cargarHabitaciones();

        } catch (err) {
            console.error(err);
            alert("No se pudo guardar la habitación");
        }
    });
});


// =======================
// Cargar tabla
// =======================

async function cargarHabitaciones() {
    try {
        const resp = await fetch(`${API_URL}/habitaciones`);
        const habitaciones = await resp.json();

        const tbody = document.getElementById("tablaHabitaciones");
        tbody.innerHTML = "";

        habitaciones.forEach(h => {
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


// =======================
// EDITAR
// =======================

function editarHabitacion(id, numero, tipo, capacidad, precioBase, estado) {
    document.getElementById("habNumero").value = numero;
    document.getElementById("habTipo").value = tipo;
    document.getElementById("habCapacidad").value = capacidad;
    document.getElementById("habPrecio").value = precioBase;
    document.getElementById("habEstado").value = estado;

    editando = true;
    idEditando = id;

    document.getElementById("form-status").textContent =
        `EDITANDO habitación ID ${id} — Guardar para aplicar cambios`;
}


// =======================
// ELIMINAR
// =======================

async function eliminarHabitacion(id) {
    if (!confirm("¿Eliminar habitación?")) return;

    try {
        const resp = await fetch(`${API_URL}/habitaciones/${id}`, { method: "DELETE" });

        if (!resp.ok) throw new Error();

        cargarHabitaciones();
    } catch (err) {
        alert("No se pudo eliminar");
    }
}
