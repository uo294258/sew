class Api {
    constructor() {
        this.circuitos = [
            {
                lat: 25.958, lng: 50.510, nombre: 'Circuito Internacional de Baréin', ciudad: 'Sakhir, Baréin',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/barein.png'
            },
            {
                lat: 24.467, lng: 54.603, nombre: 'Circuito Yas Marina', ciudad: 'Abu Dabi, Emiratos Árabes Unidos',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/yasmarina.png'
            },
            {
                lat: -37.849, lng: 144.968, nombre: 'Circuito de Albert Park', ciudad: 'Melbourne, Australia',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/albertpark.jpg'
            },
            {
                lat: 43.734, lng: 7.420, nombre: 'Circuito de Mónaco', ciudad: 'Monte Carlo, Mónaco',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/albertpark.jpg'
            },
            {
                lat: 50.437, lng: 5.971, nombre: 'Circuito de Spa-Francorchamps', ciudad: 'Stavelot, Bélgica',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/francorchamps.png'
            },
            {
                lat: 45.620, lng: 9.281, nombre: 'Autodromo Nazionale Monza', ciudad: 'Monza, Italia',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/monza.png'
            },
            {
                lat: 52.073, lng: 1.014, nombre: 'Circuito de Silverstone', ciudad: 'Silverstone, Reino Unido',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/silverstone.png'
            },
            {
                lat: 48.563, lng: 7.642, nombre: 'Circuito de Hockenheimring', ciudad: 'Hockenheim, Alemania',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/hockenheimring.png'
            },
            {
                lat: 35.511, lng: 139.618, nombre: 'Circuito de Suzuka', ciudad: 'Suzuka, Japón',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/suzuka.png'
            },
            {
                lat: 40.569, lng: -3.203, nombre: 'Circuito de Jarama', ciudad: 'Madrid, España',
                audio: 'multimedia/audios/cocheFormula.mp3', imagen: 'multimedia/imagenes/jarama.png'
            }
        ];

        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        this.cargarCanvas();
        window.addEventListener('resize', this.cargarCanvas.bind(this));
        this.crearSelect();
        this.asignarBotones();
    }

    asignarBotones() {
        const botones = document.querySelectorAll("button");
        botones[0].addEventListener("click", this.initMapaDinamico.bind(this));
      }
    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.mostrarUbicacionYDistancia();
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible";
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido";
                break;
        }
    }

    cargarCanvas() {

        var canvas = document.querySelector('canvas');
        if (canvas) {
            var context = canvas.getContext('2d');

            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;

            var flagWidth = canvasWidth / 2;
            var flagHeight = canvasHeight / 4;

            var startX = (canvasWidth - flagWidth) / 2;
            var startY = (canvasHeight - flagHeight) / 2 - 30;

            var poleWidth = canvasWidth / 50;
            var poleHeight = canvasHeight * 0.8;
            var poleX = startX - poleWidth;
            var poleY = (canvasHeight - poleHeight) / 2;

            context.fillStyle = '#000000';
            context.fillRect(poleX, poleY, poleWidth, poleHeight);


            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 5; col++) {
                    context.fillStyle = (row + col) % 2 === 0 ? '#000000' : '#FFFFFF';
                    context.fillRect(startX + col * (flagWidth / 5), startY + row * (flagHeight / 4), flagWidth / 5, flagHeight / 4);
                }
            }
        } else {
            console.error('Canvas element not found');
        }
    }

    initMapaDinamico() {

        const map = new google.maps.Map(document.querySelector("section > div"), {
            center: { lat: this.latitud, lng: this.longitud },
            zoom: 6
        });
        new google.maps.Marker({
            position: { lat: this.latitud, lng: this.longitud },
            map: map

        });


        this.circuitos.forEach(circuito => {
            const marker = new google.maps.Marker({
                position: { lat: circuito.lat, lng: circuito.lng },
                map: map,
                title: `${circuito.nombre} - ${circuito.ciudad}`
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `${circuito.nombre} ${circuito.ciudad}
                <img src="${circuito.imagen}" alt="${circuito.nombre}"">`
            });
            marker.addListener('mouseover', () => {
                infoWindow.open(map, marker);
            });

            marker.addListener('mouseout', () => {
                infoWindow.close();
            });

            marker.addListener('click', () => {
                this.playAudio(circuito.audio);
            });
        });
    }

    crearSelect() {
        const select = document.createElement("select");

        this.circuitos.forEach(circuito => {
            const optionElement = document.createElement("option");
            optionElement.value = circuito.nombre;
            optionElement.textContent = circuito.nombre;
            select.appendChild(optionElement);
        });

        document.querySelectorAll("section")[3].appendChild(select);
    }

    playAudio(audioSrc) {
        const audio = document.querySelector("audio");
        audio.src = audioSrc;
        audio.play().catch(function (error) {
            console.error('Error al reproducir el audio:', error);
        });
    }
    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c;
        return distancia;
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    mostrarUbicacionYDistancia() {
        let distanciaMinima = Infinity;
        let circuitoCercano = '';
        let distancias = [];
        this.circuitos.forEach(circuito => {
            const distancia = this.calcularDistancia(this.latitud, this.longitud, circuito.lat, circuito.lng);
            distancias.push(distancia);
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                circuitoCercano = circuito.nombre;
            }
        });
        const mensaje = `Tu ubicación es: Latitud: ${this.latitud}, Longitud: ${this.longitud}. El circuito más cercano es ${circuitoCercano}, a ${distanciaMinima.toFixed(2)} km.`;

        const parrafo = document.createElement("p");
        parrafo.textContent = mensaje;
        document.querySelectorAll('section')[2].appendChild(parrafo);
    }


}

function initMap() {
    const api = new Api();
}