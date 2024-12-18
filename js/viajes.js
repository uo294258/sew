class Viajes {
  constructor() {
    this.mensaje = "";
    this.latitud = 0;
    this.longitud = 0;
    this.asignarBotones();
    this.asignarAccionesCarrousel();
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
  }
  asignarBotones() {
    const botones = document.querySelectorAll("button");
    botones[0].addEventListener("click", this.getMapaEstaticoGoogle.bind(this));
    botones[1].addEventListener("click", this.initMapaDinamico.bind(this));
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

  getMapaEstaticoGoogle() {

    const section = document.querySelectorAll('section')[0];
    const existingImage = section.querySelector('img');
    if (existingImage) {
      section.removeChild(existingImage);
    }
    var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
    var url = "https://maps.googleapis.com/maps/api/staticmap?";
    var centro = "center=" + this.latitud + "," + this.longitud;
    var zoom = "&zoom=15";
    var tamaño = "&size=800x600";
    var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
    var sensor = "&sensor=false";

    this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
    const imagen = document.createElement("img");
    imagen.src = this.imagenMapa;
    imagen.alt = "Mapa Estático de Google";
    section.appendChild(imagen);
  }
  initMapaDinamico() {

    const map = new google.maps.Map(document.querySelector("div"), {
      center: { lat: this.latitud, lng: this.longitud },
      zoom: 14
    });
    new google.maps.Marker({
      position: { lat: this.latitud, lng: this.longitud },
      map: map
    });

  }

  asignarAccionesCarrousel() {
    const slides = document.querySelectorAll("img");
    const nextSlide = document.querySelector("article>button:nth-of-type(1)");
    let curSlide = 9;
    let maxSlide = slides.length - 1;
    nextSlide.addEventListener("click", function () {
      if (curSlide === maxSlide) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
      });
    });

    const prevSlide = document.querySelector("article>button:nth-of-type(2)");

    prevSlide.addEventListener("click", function () {
      if (curSlide === 0) {
        curSlide = maxSlide;
      } else {
        curSlide--;
      }

      slides.forEach((slide, indx) => {
        var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
      });
    });
  }
}

function initMap() {
  const viaje = new Viajes();

}

