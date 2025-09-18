//constantes o variables globales

//Constante para las alertas de SweetAlert2
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// ------------------ FUNCIONES DE RUTINAS ------------------

// Añadir rutina
function agregarRutinaDia(dia, nombre) {
    if (!nombre) return;
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    rutinas[dia].push({ nombre, ejercicios: [] });
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Borrar rutina
function borrarRutinaDia(dia, rIndex) {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    rutinas[dia].splice(rIndex, 1);
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Añadir ejercicio
function agregarEjercicioRutina(dia, rIndex, nombre, numSeries) {
    if (!nombre || !numSeries) return;
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    const nuevaSerie = { reps: 0, peso: 0 };
    const series = Array.from({ length: numSeries }, () => ({ ...nuevaSerie }));
    rutinas[dia][rIndex].ejercicios.push({ nombre, series });
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Borrar ejercicio
function borrarEjercicioRutina(dia, rIndex, eIndex) {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    rutinas[dia][rIndex].ejercicios.splice(eIndex, 1);
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Editar serie
function editarSerieRutina(dia, rIndex, eIndex, sIndex, campo, valor) {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    rutinas[dia][rIndex].ejercicios[eIndex].series[sIndex][campo] = parseInt(valor, 10) || 0;
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Borrar serie
function borrarSerieRutina(dia, rIndex, eIndex, sIndex) {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    rutinas[dia][rIndex].ejercicios[eIndex].series.splice(sIndex, 1);
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
}

// Copiar rutina individual
function copiarRutinaPortapapeles(rutina) {
    let texto = `Rutina: ${rutina.nombre}\n`;
    rutina.ejercicios.forEach((ejercicio) => {
        texto += `  - ${ejercicio.nombre}\n`;
        ejercicio.series.forEach((serie, sIndex) => {
            texto += `      Serie ${sIndex + 1}: ${serie.peso}kg x ${serie.reps} reps\n`;
        });
    });

    
    navigator.clipboard.writeText(texto).then(() => {
    Toast.fire({
        icon: 'success',
        title: 'Rutina copiada ✅'
    });

    }).catch(err => {
        Toast.fire({
            icon: 'error',
            title: 'Error al copiar: ' + err
        });
    });

}

// Copiar todas las rutinas
function copiarTodasRutinasAlPortapapeles() {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    let texto = '';

    for (const dia in rutinas) {
        texto += `=== ${dia} ===\n`;
        rutinas[dia].forEach((rutina) => {
            texto += `Rutina: ${rutina.nombre}\n`;
            rutina.ejercicios.forEach((ejercicio) => {
                texto += `  - ${ejercicio.nombre}\n`;
                ejercicio.series.forEach((serie, sIndex) => {
                    texto += `      Serie ${sIndex + 1}: ${serie.peso}kg x ${serie.reps} reps\n`;
                });
            });
            texto += '\n';
        });
        texto += '\n';
    }

        navigator.clipboard.writeText(texto).then(() => {
        Toast.fire({
            icon: 'success',
            title: '¡Todas las rutinas copiadas ✅'
        });
    }).catch(err => {
        Toast.fire({
            icon: 'error',
            title: 'Error al copiar: ' + err
        });
    });

}

// Marcar rutina como completada
function marcarRutinaCompleta(rIndex) {
    const rutinas = JSON.parse(localStorage.getItem('rutinas'));
    const rutina = rutinas[diaSeleccionado][rIndex];

    const historial = JSON.parse(localStorage.getItem('historial')) || [];

    historial.unshift({
        fecha: new Date().toISOString(),
        rutina: rutina.nombre,
        ejercicios: rutina.ejercicios
    });

    localStorage.setItem('historial', JSON.stringify(historial));
    
    Toast.fire({
    icon: 'success',
    title: `Rutina "${rutina.nombre}" completada ✅`   
    });

    mostrarHistorial();

}
