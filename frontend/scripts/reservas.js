async function cargarReservas() {
    try {
        const res = await fetch("http://localhost:3000/reservas");
        const data = await res.json();

        const tabla = document.getElementById("tablaReservas");
        tabla.innerHTML = "";

        data.forEach(r => {
            tabla.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.habitacion_id}</td>
                    <td>${r.persona_id}</td>
                    <td>${formatearFecha(r.check_in)}</td>
                    <td>${formatearFecha(r.check_out)}</td>
                    <td>$${r.monto}</td>
                    <td>${r.estado}</td>
                </tr>
            `;
        });

    } catch (e) {
        console.error("Error cargando reservas:", e);
    }
}

function formatearFecha(f) {
    return new Date(f).toLocaleDateString("es-AR");
}

document.addEventListener("DOMContentLoaded", cargarReservas);
