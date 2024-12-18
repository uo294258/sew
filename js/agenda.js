class Agenda {
    constructor() {
        //this.apiURL="http://ergast.com/api/f1/current/races.json";
        this.apiURL = "https://api.jolpi.ca/ergast/f1/current.json";
        this.asignarAccionBoton();
    }

    asignarAccionBoton() {
        const boton = document.querySelector("button");
        boton.onclick = () => this.obtenerCarreras();
    }
    obtenerCarreras() {
        $.ajax({
            url: this.apiURL,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.mostrarCarreras(data.MRData.RaceTable.Races);
            },
            error: function () {
                console.error("Error en la solicitud:");

            }
        });
    }

    mostrarCarreras(carreras) {
        const $section = $("section");
        $section.find("article").remove();
        if (carreras.length === 0) {
            const $mensaje = $("<p>").text("No se encontraron carreras.");
            $section.append($mensaje);
            return;
        }

        carreras.forEach(carrera => {
            const $contenedorCarrera = $("<article></article>");

            const $nombreCarrera = $("<h4>").text(`Nombre de la carrera: ${carrera.raceName}`);
            $contenedorCarrera.append($nombreCarrera);

            const $nombreCircuito = $("<p>").text(`Circuito: ${carrera.Circuit.circuitName}`);
            $contenedorCarrera.append($nombreCircuito);

            const $ubicacion = $("<p>").text(`Ubicación: ${carrera.Circuit.Location.locality}, ${carrera.Circuit.Location.country}`);
            $contenedorCarrera.append($ubicacion);

            const $coordenadas = $("<p>").text(`Coordenadas: ${carrera.Circuit.Location.lat}, ${carrera.Circuit.Location.long}`);
            $contenedorCarrera.append($coordenadas);

            const $fecha = $("<p>").text(`Fecha: ${carrera.date}`);
            $contenedorCarrera.append($fecha);

            const $hora = $("<p>").text(`Hora: ${carrera.time ? carrera.time : 'No disponible'}`);
            $contenedorCarrera.append($hora);

            $section.append($contenedorCarrera);
        });

    }
}