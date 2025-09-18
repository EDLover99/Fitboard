// ------------------ VARIABLES ------------------
const diasBtns = document.querySelectorAll('.dia-btn');
const agregarRutinaBtn = document.getElementById('agregarRutina');
const nuevaRutinaInput = document.getElementById('nuevaRutina');
const rutinasContainer = document.getElementById('rutinasContainer');
const copiarTodasBtn = document.getElementById('copiarTodasRutinas');
const toggleHistorialBtn = document.getElementById('toggleHistorial');
const historialContainer = document.getElementById('historialContainer');

let diaSeleccionado = "Lunes";

// Inicializar localStorage si no existe
if (!localStorage.getItem('rutinas')) {
    localStorage.setItem('rutinas', JSON.stringify({
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: []
    }));
}


// ------------------ EVENTOS ------------------

// Cambiar día
diasBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diaSeleccionado = btn.dataset.dia;
        mostrarRutinas();
    });
});

// Añadir rutina
agregarRutinaBtn.addEventListener('click', () => {
    const nombre = nuevaRutinaInput.value.trim();
    if (!nombre) return;
    agregarRutinaDia(diaSeleccionado, nombre);
    nuevaRutinaInput.value = "";
    mostrarRutinas();
});

// Copiar todas las rutinas
copiarTodasBtn.addEventListener('click', () => {
    copiarTodasRutinasAlPortapapeles();
});

// Mostrar/ocultar historial
toggleHistorialBtn.addEventListener('click', () => {
    if (historialContainer.style.display === "none" || !historialContainer.style.display) {
        historialContainer.style.display = "block";
        mostrarHistorial();
        toggleHistorialBtn.textContent = "Ocultar historial";
    } else {
        historialContainer.style.display = "none";
        toggleHistorialBtn.textContent = "Mostrar historial";
    }
});

// ------------------ FUNCIONES DOM ------------------
function mostrarRutinas() {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    const rutinasDia = rutinas[diaSeleccionado];
    rutinasContainer.innerHTML = "";

    rutinasDia.forEach((rutina, rIndex) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';

        // Card principal de la rutina
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${rutina.nombre}</h5>
                <div id="ejercicios-${rIndex}"></div>
                <div class="card-buttons">
                    <button class="btn btn-sm btn-outline-success" onclick="agregarEjercicioRutinaPrompt(${rIndex})">+ Añadir ejercicio</button>
                    <button class="btn btn-sm btn-danger" onclick="borrarRutinaDia('${diaSeleccionado}', ${rIndex}); mostrarRutinas()">Borrar rutina</button>
                    <button class="btn btn-sm btn-warning" onclick="copiarRutinaPortapapeles(JSON.parse(localStorage.getItem('rutinas'))['${diaSeleccionado}'][${rIndex}])">Copiar</button>
                    <button class="btn btn-sm btn-info" onclick="marcarRutinaCompleta(${rIndex})">Marcar como completa</button>
                </div>
            </div>
        `;

        rutinasContainer.appendChild(card);

        // Contenedor de ejercicios
        const ejerciciosContainer = document.getElementById(`ejercicios-${rIndex}`);
        rutina.ejercicios.forEach((ejercicio, eIndex) => {
            const ejDiv = document.createElement('div');
            ejDiv.className = 'border rounded p-2 mb-2 series-container';

            // Series
            let seriesHTML = "";
            ejercicio.series.forEach((serie, sIndex) => {
                seriesHTML += `
                    <div class="serie-item">
                        <span>Serie ${sIndex + 1}:</span>
                        <input type="number" class="form-control form-control-sm" value="${serie.peso || ''}" placeholder="kg"
                            onchange="editarSerieRutina('${diaSeleccionado}', ${rIndex}, ${eIndex}, ${sIndex}, 'peso', this.value)"> kg
                        <input type="number" class="form-control form-control-sm" value="${serie.reps || ''}" placeholder="reps"
                            onchange="editarSerieRutina('${diaSeleccionado}', ${rIndex}, ${eIndex}, ${sIndex}, 'reps', this.value)"> reps
                        <button class="btn btn-sm btn-danger" onclick="borrarSerieRutina('${diaSeleccionado}', ${rIndex}, ${eIndex}, ${sIndex}); mostrarRutinas()">X</button>
                    </div>
                `;
            });

            // Ejercicio con botón para borrar ejercicio completo
            ejDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6>${ejercicio.nombre}</h6>
                    <button class="btn btn-sm btn-danger" onclick="borrarEjercicioRutina('${diaSeleccionado}', ${rIndex}, ${eIndex}); mostrarRutinas()">Borrar ejercicio</button>
                </div>
                ${seriesHTML}
            `;

            ejerciciosContainer.appendChild(ejDiv);
        });
    });
}



// Función para prompt de añadir ejercicio
function agregarEjercicioRutinaPrompt(rIndex) {
    Swal.fire({
        title: 'Añadir ejercicio',
        html:
            `<input id="swal-nombre" class="swal2-input" placeholder="Nombre del ejercicio">` +
            `<label for="swal-series" style="display:block; text-align:center; margin-top:10px; font-weight:500;">Series:</label>` +
            `<input id="swal-series" type="number" min="1" class="swal2-input" placeholder="Número de series">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Añadir',
        width: '90%',
        preConfirm: () => {
            const nombre = document.getElementById('swal-nombre').value.trim();
            const numSeries = parseInt(document.getElementById('swal-series').value, 10);
            if (!nombre || !numSeries || numSeries < 1) {
                Swal.showValidationMessage('Debes ingresar un nombre y al menos 1 serie');
                return false;
            }
            return { nombre, numSeries };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            agregarEjercicioRutina(diaSeleccionado, rIndex, result.value.nombre, result.value.numSeries);
            mostrarRutinas();
            Toast.fire({
                icon: 'success',
                title: `Ejercicio "${result.value.nombre}" añadido ✅`
            });
        }
    });
}



document.addEventListener("DOMContentLoaded", () => {
    mostrarRutinas();
});
