const API_URL = "http://localhost:3000/api";

let editandoRes = false;
let idEditandoRes = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarReservas();

    const form = document.getElementById("formReserva");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const reserva = {
            persona_id: parseInt(document.getElementById("resPersona").value),
            habitacion_id: parseInt(document.getElementById("resHabitacion").value),
            check_in: document.getElementById("resCheckIn").value,
            check_out: document.getElementById("resCheckOut").value
        };

        try {
            let resp;

            if (editandoRes) {
                resp = await fetch(`${API_URL}/reservas/${idEditandoRes}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reserva)
                });
            } else {
                resp = await fetch(`${API_URL}/reservas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reserva)
                });
            }

            if (!resp.ok) throw new Error();

            form.reset();
            editandoRes = false;
            idEditandoRes = null;
            document.getElementById("form-status").textContent = "";

            cargarReservas();

        } catch (err) {
            alert("No se pudo guardar la reserva");
        }
    });
});

async function cargarCombos() {
    const [resPers, resHab] = await Promise.all([
        fetch(`${API_URL}/personas`),
        fetch(`${API_URL}/habitaciones`)
    ]);

    const personas = await resPers.json();
    const habitaciones = await resHab.json();

    const selPers = document.getElementById("resPersona");
    const selHab = document.getElementById("resHabitacion");

    selPers.innerHTML = "";
    selHab.innerHTML = "";

    personas.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.dni} - ${p.nombre}`;
        selPers.appendChild(opt);
    });

    habitaciones.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h.id;
        opt.textContent = `${h.numero} (${h.estado})`;
        selHab.appendChild(opt);
    });
}

async function cargarReservas() {
    const resp = await fetch(`${API_URL}/reservas`);
    const reservas = await resp.json();

    const tbody = document.getElementById("tablaReservas");
    tbody.innerHTML = "";

    reservas.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.habitacionId}</td>
            <td>${r.personaId}</td>
            <td>${r.checkIn.substring(0,10)}</td>
            <td>${r.checkOut.substring(0,10)}</td>
            <td>${r.monto}</td>
            <td>${r.estado}</td>
            <td class="acciones">
                <button onclick="editarReserva(${r.id}, ${r.personaId}, ${r.habitacionId}, '${r.checkIn}', '${r.checkOut}')">✏️</button>
                <button onclick="eliminarReserva(${r.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarReserva(id, persona, habitacion, check_in, check_out) {
    document.getElementById("resPersona").value = persona;
    document.getElementById("resHabitacion").value = habitacion;
    document.getElementById("resCheckIn").value = check_in.substring(0, 10);
    document.getElementById("resCheckOut").value = check_out.substring(0, 10);

    editandoRes = true;
    idEditandoRes = id;

    document.getElementById("form-status").textContent =
        `EDITANDO reserva ID ${id}`;
}

async function eliminarReserva(id) {
    if (!confirm("¿Eliminar reserva?")) return;

    await fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" });
    cargarReservas();
}
