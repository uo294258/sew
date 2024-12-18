class Circuito {
    constructor() {
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            console.log("Tu navegador no soporta la API File.");
        }
        this.mensaje = "";
        this.latitud = 0;
        this.longitud = 0;

        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
    }
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }

    procesarArchivo(files) {
        const archivo = files[0];
        const actual = this;
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
                actual.mostrarXMLComoHTML(xmlDoc);
            };
            reader.readAsText(archivo);
        }
    }


    mostrarXMLComoHTML(xmlDoc) {
        const $section = $("section").first();
        $section.find("section").remove();
        const $nuevaSection = $("<section>");

        const nombre = $(xmlDoc).find("nombre").text();
        $("<h4>").text(nombre).appendTo($nuevaSection);

        const detalles = $("<ul>");
        detalles.append(
            $("<li>").html(`<strong>Longitud del Circuito:</strong> ${$(xmlDoc).find("longitudCircuito").text()} km`),
            $("<li>").html(`<strong>Anchura:</strong> ${$(xmlDoc).find("anchura").text()} m`),
            $("<li>").html(`<strong>Fecha:</strong> ${$(xmlDoc).find("fecha").text()}`),
            $("<li>").html(`<strong>Hora de Inicio:</strong> ${$(xmlDoc).find("horainicio").text()}`),
            $("<li>").html(`<strong>Número de Vueltas:</strong> ${$(xmlDoc).find("numvueltas").text()}`),
            $("<li>").html(`<strong>Localidad:</strong> ${$(xmlDoc).find("localidad").text()}`),
            $("<li>").html(`<strong>País:</strong> ${$(xmlDoc).find("pais").text()}`)
        );
        $nuevaSection.append(detalles);

        const $referencias = $(xmlDoc).find("referencia");
        if ($referencias.length) {
            $("<h4>").text("Referencias").appendTo($nuevaSection);
            const ulReferencias = $("<ul>");
            $referencias.each(function () {
                const enlace = $(this).attr("enlace");
                const texto = $(this).text();
                $("<li>").append($("<a>").attr("href", enlace).text(texto)).appendTo(ulReferencias);
            });
            $nuevaSection.append(ulReferencias);
        }

        const $imagenes = $(xmlDoc).find("imagen");
        if ($imagenes.length) {
            $("<h4>").text("Galería de Imágenes").appendTo($nuevaSection);
            const ulImagenes = $("<ul>");
            $imagenes.each(function () {
                const archivo = $(this).attr("archivo");
                const texto = $(this).text();
                $("<li>").append(
                    $("<figure>").append(
                        $("<img>").attr("src", `multimedia/imagenes/${archivo}`).attr("alt", texto),
                        $("<figcaption>").text(texto)
                    )
                ).appendTo(ulImagenes);
            });
            $nuevaSection.append(ulImagenes);
        }

        const $videos = $(xmlDoc).find("video");
        if ($videos.length) {
            $("<h4>").text("Galería de Videos").appendTo($nuevaSection);
            const ulVideos = $("<ul>");
            $videos.each(function () {
                const archivo = $(this).attr("archivo");
                $("<li>").append(
                    $("<video>").attr("controls", true).append(
                        $("<source>").attr("src", `multimedia/videos/${archivo}`).attr("type", "video/mp4")
                    )
                ).appendTo(ulVideos);
            });
            $nuevaSection.append(ulVideos);
        }

        const $coordenadas = $(xmlDoc).find("coordenadas");
        if ($coordenadas.length) {
            const longitud = $coordenadas.find("longitud").text().trim();
            const latitud = $coordenadas.find("latitud").text().trim();
            const altitud = $coordenadas.find("altitud").text().trim();
            $("<p>").html(`<strong>Origen Meta:</strong> Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud} m`).appendTo($nuevaSection);
        }

        const $tramos = $(xmlDoc).find("tramo");
        if ($tramos.length) {
            $("<h3>").text("Tramos:").appendTo($nuevaSection);
            let contador = 1;
            $tramos.each(function () {
                $("<h4>").text(`Tramo ${contador}`).appendTo($nuevaSection);
                const ulTramo = $("<ul>");
                ulTramo.append(
                    $("<li>").html(`<strong>Distancia:</strong> ${$(this).find("distancia").text().trim()} m`),
                    $("<li>").append(
                        $("<ul>").append(
                            $("<li>").html(`<strong>Longitud:</strong> ${$(this).find("coordenadasfinales longitud").text().trim()}`),
                            $("<li>").html(`<strong>Latitud:</strong> ${$(this).find("coordenadasfinales latitud").text().trim()}`),
                            $("<li>").html(`<strong>Altitud:</strong> ${$(this).find("coordenadasfinales altitud").text().trim()} m`)
                        )
                    ),
                    $("<li>").html(`<strong>Número de Sector:</strong> ${$(this).find("numerosector").text().trim()}`)
                );
                $nuevaSection.append(ulTramo);
                contador++;
            });
        }

        // Añadir la nueva sección a la primera sección
        $section.append($nuevaSection);
    }
    initMapaDinamico() {
        this.map = new google.maps.Map($("div")[0], {
            center: { lat: this.latitud, lng: this.longitud },
            zoom: 14
        });
    }

    procesarArchivoKML(files) {
        this.initMapaDinamico();

        const archivo = files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                const kmlContent = e.target.result;
                this.mostrarContenidoKML(kmlContent);
            };
            lector.readAsText(archivo);
        }
    }

    mostrarContenidoKML(kmlContent) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kmlContent, "application/xml");
            const coordenadas = $(xmlDoc).find("coordinates");


            const lineString = coordenadas[1].textContent.trim().split("\n").map(line => {
                const coords = line.trim().split(",");
                return {
                    lat: parseFloat(coords[1]),
                    lng: parseFloat(coords[0]),
                    alt: parseFloat(coords[2])
                };
            });

            if (lineString.length > 0) {
                const firstCoordinate = lineString[0];
                this.map.setCenter({ lat: firstCoordinate.lat, lng: firstCoordinate.lng });
                this.map.setZoom(14);
            }

            const linePath = lineString.map(coord => ({ lat: coord.lat, lng: coord.lng }));

            const line = new google.maps.Polyline({
                path: linePath,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            line.setMap(this.map);

        } catch (error) {
            console.error("Error al procesar el archivo KML:", error.message);
        }
    }

    procesarArchivoSVG(files) {
        const archivo = files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                const svgContent = e.target.result;
                this.mostrarContenidoSVG(svgContent);
            };
            lector.readAsText(archivo);
        }
    }

    mostrarContenidoSVG(svgContent) {
        try {
            $("section").last().find("img").remove();
            const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
            const svgURL = URL.createObjectURL(svgBlob);

            $("section").last().append(
                $("<img>").attr({
                    src: svgURL,
                    alt: "SVG Image"
                })
            );
        } catch (error) {
            console.error("Error al procesar el archivo SVG:", error.message);
        }
    }

}

