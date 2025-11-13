async function cargarHabitaciones() {
    try {
        const res = await fetch("http://localhost:3000/habitaciones");
        const data = await res.json();

        const tbody = document.getElementById("listaHabitaciones");
        tbody.innerHTML = "";

        data.forEach(h => {
            const fila = `
                <div class="card">
                    <p><b>Número:</b> ${h.numero}</p>
                    <p><b>Tipo:</b> ${h.tipo}</p>
                    <p><b>Capacidad:</b> ${h.capacidad}</p>
                    <p><b>Precio base:</b> $${h.precio_base}</p>
                    <p><b>Estado:</b> ${h.estado}</p>
                </div>
            `;
            tbody.innerHTML += fila;
        });

    } catch (e) {
        console.error("Error cargando habitaciones:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarHabitaciones();

    document.getElementById("formHabitacion")?.addEventListener("submit", async e => {
        e.preventDefault();

        const numero = e.target[0].value;
        const tipo = e.target[1].value;
        const precio = e.target[2].value;
        const estado = e.target[3].value;

        await fetch("http://localhost:3000/habitaciones", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ numero, tipo, precio_base: precio, estado })
        });

        cargarHabitaciones(); // refresca tabla
        e.target.reset();
    });
});
