const API_URL = "http://localhost:3000/api";

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
            const resp = await fetch(`${API_URL}/personas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(persona)
            });

            if (!resp.ok) throw new Error("Error al guardar persona");

            form.reset();
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
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las personas");
    }
}
