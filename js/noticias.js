class Noticias{
    constructor(){
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert("Tu navegador no soporta la API File.");
        }
        this.asignarAccionBoton();
    }

    readInputFile(files) {
      var archivo = files[0];       
      //Solamente admite archivos de tipo texto
      var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
        {
          var lector = new FileReader();
          const actual = this;
          lector.onload = function (evento) {
            const lines = evento.target.result.split('\n');
                lines.forEach((line) => {
                    const [titular, entradilla, autor] = line.split('_');
                    actual.addNoticiaToHTML(titular, entradilla, autor);
                });
            }      
          lector.readAsText(archivo);
          }
        
  };

  addNoticiaToHTML(titular, entradilla, autor) {
    const section = document.querySelector("section");
    const article = document.createElement("article");

    const h2 = document.createElement("h2");
    h2.textContent = titular;
    article.appendChild(h2);

    const parrafoE = document.createElement("p");
    parrafoE.textContent = entradilla;
    article.appendChild(parrafoE);

    const parrrafoA = document.createElement("p");
    parrrafoA.textContent = `Autor: ${autor}`;
    article.appendChild(parrrafoA);

    section.appendChild(article);
}

agregarNoticiaManual() {
    const titular = document.getElementsByName('titular')[0].value.trim();
    const entradilla = document.getElementsByName('entradilla')[0].value.trim();
    const autor = document.getElementsByName('autor')[0].value.trim();

    if (titular && entradilla && autor) {
        this.addNoticiaToHTML(titular, entradilla, autor);
        document.getElementsByName('titular')[0].value = "";
        document.getElementsByName('entradilla')[0].value = "";
        document.getElementsByName('autor')[0].value = "";
    } 
    else {
        alert("Todos los campos son obligatorios.");
    }
}
asignarAccionBoton(){
    const boton = document.querySelector("button");
    boton.onclick=()=>this.agregarNoticiaManual();
}
}

