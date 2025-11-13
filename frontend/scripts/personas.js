const API_URL = "http://localhost:3000/api";

let editandoPers = false;
let idEditandoPers = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarPersonas();

    const form = document.getElementById("formPersona");
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const persona = {
        dni: document.getElementById("perDni").value,
        nombre: document.getElementById("perNombre").value,
        email: document.getElementById("perEmail").value,
        telefono: document.getElementById("perTelefono").value
    };

    try {
        let resp;

        if (editandoPers) {
            resp = await fetch(`${API_URL}/personas/${idEditandoPers}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(persona)
            });
        } else {
            resp = await fetch(`${API_URL}/personas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(persona)
            });
        }

        if (!resp.ok) throw new Error("Error al guardar persona");

        form.reset();
        editandoPers = false;
        idEditandoPers = null;
        document.getElementById("form-status").textContent = "";

        await cargarPersonas();

    } catch (err) {
        console.error(err);
        alert("No se pudo guardar la persona");
    }
});

});


async function cargarPersonas() {
    try {
        const resp = await fetch(`${API_URL}/personas`);
        const personas = await resp.json();

        const tbody = document.getElementById("tablaPersonas");
        tbody.innerHTML = "";

        personas.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.dni}</td>
                <td>${p.nombre}</td>
                <td>${p.email}</td>
                <td>${p.telefono}</td>
                <td class="acciones">
                    <button class="btn-edit" onclick="editarPersona(${p.id}, '${p.dni}', '${p.nombre}', '${p.email}', '${p.telefono}')">✏️</button>
                    <button class="btn-delete" onclick="eliminarPersona(${p.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        alert("No se pudieron cargar las personas");
    }
}

function editarPersona(id, dni, nombre, email, telefono) {
    document.getElementById("perDni").value = dni;
    document.getElementById("perNombre").value = nombre;
    document.getElementById("perEmail").value = email;
    document.getElementById("perTelefono").value = telefono;

    editandoPers = true;
    idEditandoPers = id;

    document.getElementById("form-status").textContent =
        `EDITANDO persona ID ${id} — Guardar para aplicar cambios`;
}


async function eliminarPersona(id) {
    if (!confirm("¿Eliminar persona?")) return;

    const resp = await fetch(`${API_URL}/personas/${id}`, { method: "DELETE" });
    cargarPersonas();
}
