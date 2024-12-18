class Fondo{
    constructor(nombrePais,nombreCapital,nombreCircuito){
        this.nombrePais=nombrePais;
        this.nombreCapital=nombreCapital;
        this.nombreCircuito=nombreCircuito;
    }   

    obtenerImagenCircuito() {
        var apiKey = "3fcfd80b7e40e27490cbd60a35f04534";
        var photoId = "35797631472";
        const flickrAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${apiKey}&photo_id=${photoId}&format=json&nojsoncallback=1`;
        
        $.getJSON(flickrAPI)
        .done(function(data) {
            if (data.photo) {
                var foto = data.photo;
                var imageUrl = `https://live.staticflickr.com/${foto.server}/${foto.id}_${foto.secret}_b.jpg`;
                
                $("body").css("background-image", `url(${imageUrl})`);
            }
        })
        .fail(function() {
            console.log("Error al obtener la imagen.");
        });
    }
    
    
    
}