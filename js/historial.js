// ------------------ FUNCIONES DE HISTORIAL ------------------

// Función para mostrar el historial
function mostrarHistorial() {
    const historialContainer = document.getElementById('historialContainer');
    historialContainer.innerHTML = ""; // limpiar contenido previo

    const historial = JSON.parse(localStorage.getItem('historial')) || [];

    if (historial.length === 0) {
        historialContainer.innerHTML = "<p>No hay rutinas completadas todavía.</p>";
        return;
    }

    historial.forEach((entry, index) => {
        const fecha = new Date(entry.fecha).toLocaleString();

        const card = document.createElement('div');
        card.className = "card mb-2";

        // ------------------ CARD HEADER ------------------
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <button class="btn btn-link text-decoration-none p-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    ${fecha} - ${entry.rutina}
                </button>
                <button class="btn btn-sm btn-danger" onclick="borrarRutinaHistorial(${index}); mostrarHistorial()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div id="collapse${index}" class="collapse" data-bs-parent="#historialContainer">
                <div class="card-body">
                    ${entry.ejercicios.map(ej => `
                        <p><strong>${ej.nombre}</strong></p>
                        <ul>
                            ${ej.series.map((s, i) => `<li>Serie ${i+1}: ${s.peso}kg x ${s.reps} reps</li>`).join("")}
                        </ul>
                    `).join("")}
                </div>
            </div>
        `;

        historialContainer.appendChild(card);
    });
}

// ------------------ BORRAR RUTINA DEL HISTORIAL ------------------
function borrarRutinaHistorial(index) {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.splice(index, 1); // elimina la rutina
    localStorage.setItem('historial', JSON.stringify(historial));
}

