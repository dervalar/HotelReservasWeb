const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarReservas();

    const form = document.getElementById("formReserva");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const reserva = {
            personaId: parseInt(document.getElementById("resPersona").value),
            habitacionId: parseInt(document.getElementById("resHabitacion").value),
            checkIn: document.getElementById("resCheckIn").value,
            checkOut: document.getElementById("resCheckOut").value
        };

        try {
            const resp = await fetch(`${API_URL}/reservas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva)
            });

            if (!resp.ok) throw new Error("Error al guardar reserva");

            form.reset();
            await cargarReservas();
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar la reserva");
        }
    });
});

// Cargar select de personas + habitaciones
async function cargarCombos() {
    try {
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

        // Personas
        personas.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;       // ESTE ES EL ID CORRECTO
            opt.textContent = `${p.dni} - ${p.nombre}`;
            selPers.appendChild(opt);
        });

        // Habitaciones
        habitaciones.forEach(h => {
            const opt = document.createElement("option");
            opt.value = h.id;       // ANTES PONÍAS h.numero Y ESO ESTABA MAL
            opt.textContent = `${h.numero} (${h.estado})`;
            selHab.appendChild(opt);
        });

    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar personas/habitaciones para las reservas");
    }
}


// Cargar tabla de reservas
async function cargarReservas() {
    try {
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
                <td>${r.monto ?? "—"}</td>
                <td>${r.estado ?? "—"}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las reservas");
    }
}
