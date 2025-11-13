async function cargarPersonas() {
    try {
        const res = await fetch("http://localhost:3000/personas");
        const data = await res.json();

        const tabla = document.getElementById("tablaPersonas");
        tabla.innerHTML = "";

        data.forEach(p => {
            tabla.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.dni}</td>
                    <td>${p.nombre}</td>
                    <td>${p.email}</td>
                    <td>${p.telefono}</td>
                </tr>
            `;
        });

    } catch (e) {
        console.error("Error cargando personas:", e);
    }
}

document.addEventListener("DOMContentLoaded", cargarPersonas);
