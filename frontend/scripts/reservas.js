const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarReservas();

    const form = document.getElementById("formReserva");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const reserva = {
            persona_id: parseInt(document.getElementById("resPersona").value, 10),
            habitacion_id: parseInt(document.getElementById("resHabitacion").value, 10),
            check_in: document.getElementById("resCheckIn").value,
            check_out: document.getElementById("resCheckOut").value
            // monto y estado los puede calcular/poner el backend si querés
        };

        try {
            const resp = await fetch(`${API_URL}/reservas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva)
            });

            if (!resp.ok) {
                throw new Error("Error al guardar reserva");
            }

            form.reset();
            await cargarReservas();
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar la reserva");
        }
    });
});

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

    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar personas/habitaciones para las reservas");
    }
}

async function cargarReservas() {
    try {
        const resp = await fetch(`${API_URL}/reservas`);
        const reservas = await resp.json();

        const tbody = document.getElementById("tablaReservas");
        tbody.innerHTML = "";

        reservas.forEach(r => {
            // Adaptá estos nombres según lo que devuelva tu API:
            // uso nombres típicos: numeroHabitacion, dniPersona, etc.
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.numeroHabitacion ?? r.habitacion_id}</td>
                <td>${r.dniPersona ?? r.persona_id}</td>
                <td>${r.check_in}</td>
                <td>${r.check_out}</td>
                <td>${r.monto ?? ""}</td>
                <td>${r.estado ?? ""}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las reservas");
    }
}
