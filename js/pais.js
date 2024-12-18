class Pais {
    constructor(nombre, nombreCapital, cantPoblacion) {
        this.nombre = nombre;
        this.nombreCapital = nombreCapital;
        this.cantPoblacion = cantPoblacion;

    }

    rellanarSecundario(nombreCircuito, formGobierno, coordLineaMeta, religion) {
        this.nombreCircuito = nombreCircuito;
        this.formGobierno = formGobierno;
        this.coordLineaMeta = coordLineaMeta;
        this.religion = religion;
    }
    obtenerNombre() {
        return "País: " + this.nombre;
    }
    obtenerNombreCapital() {
        return "Capital: " + this.nombreCapital;
    }

    obtenerInformacionSecundaria() {
        return (
            `<ul>
            <li>Nombre del circuito: ${this.nombreCircuito}</li>
            <li>Población: ${this.cantPoblacion}</li>
            <li>Forma de Gobierno: ${this.formGobierno}</li>
            <li>Religión Mayoritaria: ${this.religion}</li>
            </ul>`
        );
    }
    obtenerCoordLineaMeta() {
        const { lat, lon } = this.coordLineaMeta;
        document.write(`<p>Coordenadas de la línea de meta: Latitud ${lat}, Longitud ${lon}</p>`);
    }

    obtenerPrevisionTiempo() {
        var apiKey = "4c077761420dae1a2430a9de2fc805ca";
        var urlAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=30.1335256&lon=-97.6422641&appid=" + apiKey + "&mode=xml";  // Añadimos el parámetro 'mode=xml' para obtener los datos en XML

        $.ajax({
            url: urlAPI,
            method: 'GET',
            dataType: 'xml',
            success: (data) => {
                $('main').empty();
                let count = 0;

                $(data).find('time').each((i, dayData) => {
                    if (count >= 5) return;
                    const fecha = $(dayData).attr('from');
                    const hora = $(dayData).attr('from').substring(11, 19);


                    if (hora === "12:00:00") {
                        const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES");

                        const temperaturaMax = $(dayData).find('temperature').attr('max');
                        const temperaturaMin = $(dayData).find('temperature').attr('min');
                        const humedad = $(dayData).find('humidity').attr('value');
                        const icono = $(dayData).find('symbol').attr('var');
                        const lluvia = $(dayData).find('precipitation').attr('value') || 0;

                        const tempMaxCelsius = Math.round(temperaturaMax - 273.15);
                        const tempMinCelsius = Math.round(temperaturaMin - 273.15);

                        this.mostrarPronostico(fechaFormateada, tempMaxCelsius, tempMinCelsius, humedad, icono, lluvia);

                        count++;
                    }
                });
            },
            error: function () {
                console.error("Error al obtener los datos");
            }
        });
    }

    mostrarPronostico(fecha, tempMax, tempMin, humedad, icono, lluvia) {
        const articulo = $('<article></article>');

        const h2 = $('<h2></h2>').text(fecha);
        articulo.append(h2);

        const img = $('<img>').attr({
            'src': `https://openweathermap.org/img/wn/${icono}.png`,
            'alt': `Icono del clima para ${fecha}`,
            'title': `Pronóstico del clima en ${fecha}`
        });

        articulo.append(img);

        const pTempMax = $('<p></p>').text(`Temperatura máxima: ${tempMax}°C`);
        articulo.append(pTempMax);

        const pTempMin = $('<p></p>').text(`Temperatura mínima: ${tempMin}°C`);
        articulo.append(pTempMin);

        const pHumedad = $('<p></p>').text(`Humedad: ${humedad}%`);
        articulo.append(pHumedad);

        const pLluvia = $('<p></p>').text(`Lluvia: ${lluvia} mm`);
        articulo.append(pLluvia);

        $('section').append(articulo);
    }

}