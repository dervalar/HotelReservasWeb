const API_URL = "http://localhost:3000/api";

// Cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarHabitaciones();

    const form = document.getElementById("formHabitacion");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const habitacion = {
            numero: document.getElementById("habNumero").value,
            tipo: document.getElementById("habTipo").value,
            capacidad: parseInt(document.getElementById("habCapacidad").value, 10),
            precioBase: parseFloat(document.getElementById("habPrecio").value),
            estado: document.getElementById("habEstado").value,
        };

        try {
            const resp = await fetch(`${API_URL}/habitaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(habitacion)
            });

            if (!resp.ok) throw new Error("Error al guardar habitación");

            form.reset();
            document.getElementById("habEstado").value = "DISPONIBLE";
            await cargarHabitaciones();
        } catch (err) {
            console.error(err);
            alert("No se pudo guardar la habitación");
        }
    });
});

// Cargar tabla
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
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las habitaciones");
    }
}
