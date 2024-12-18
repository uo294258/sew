<?php
class Carrusel
{
	private $capital;
	private $pais;

	private $fotos;

	public function __construct($capital, $pais)
	{
		$this->capital = $capital;
		$this->pais = $pais;
		$this->fotos = [];
	}

	public function obtenerImagenesCarrusel()
	{
		$url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
		$url .= '&api_key=3fcfd80b7e40e27490cbd60a35f04534';
		$url .= '&tags=' . urlencode($this->capital) . ',' . urlencode($this->pais);
		$url .= '&per_page=10';
		$url .= '&format=json';
		$url .= '&nojsoncallback=1';
		$respuesta = file_get_contents($url);
		$json = json_decode($respuesta);

		foreach ($json->photos->photo as $foto) {
			$fotoUrl = "https://live.staticflickr.com/" . $foto->server . "/" . $foto->id . "_" . $foto->secret . "_m.jpg";
			$foto = [
				'title' => $foto->title,
				'url' => $fotoUrl
			];
			$this->fotos[] = $foto;

		}

		$this->mostrarCarrusel();
	}

	public function mostrarCarrusel()
	{

		echo "<article>";
		echo "<h3>Carrusel de Imágenes</h3>";
		foreach ($this->fotos as $foto) {
			echo "<img alt='" . $foto['title'] . "' src='" . $foto['url'] . "' />";
		}
		echo "<button> &gt; </button>";
		echo "<button> &lt; </button>";
		echo "</article>";
	}
}

class Moneda
{
	private $siglasLocal;
	private $siglasCambio;


	public function __construct($siglasLocal, $siglasCambio)
	{
		$this->siglasLocal = $siglasLocal;
		$this->siglasCambio = $siglasCambio;
	}


	public function getExchangeRate()
	{
		$req_url = 'https://v6.exchangerate-api.com/v6/a0830980f53b9996ec6520d2/latest/' . $this->siglasLocal;
		$response_json = file_get_contents($req_url);
		if (false !== $response_json) {
			try {
				$response = json_decode($response_json);
				if ('success' === $response->result) {
					$base_price = 1;
					$CHANGE_PRICE = round(($base_price * $response->conversion_rates->{$this->siglasCambio}), 3);
					echo "<section>";
					echo "<h3>Cambio de Moneda</h3>";
					echo "<p>El cambio de {$this->siglasLocal} a {$this->siglasCambio} es: {$CHANGE_PRICE}</p>";
					echo "</section>";
				}

			} catch (Exception $e) {
			}

		}

	}
}
?>
<!DOCTYPE HTML>

<html lang="es">

<head>
	<!-- Datos que describen el documento -->
	<meta charset="UTF-8" />
	<title>F1 Desktop-Viajes</title>
	<meta name="author" content="Zinedine Alvarez" />
	<meta name="description" content="Viajes del proyecto F1" />
	<meta name="keywords" content="geolocation, mapas, carrousel, viajes" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel="icon" href="../multimedia/imagenes/favicon.ico" />
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script async defer
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBF83QHMw7hzPltIi4evByloZao-Qu0naQ&callback=initMap"></script>
	<script src="../js/viajes.js"></script>
</head>

<body>
	<!-- Datos con el contenidos que aparece en el navegador -->
	<header>
		<h1><a href="../index.html">F1 Desktop </a></h1>

		<nav>
			<a href="../index.html" title="index">Inicio</a>
			<a href="../piloto.html" title="piloto">Piloto</a>
			<a href="../noticias.html" title="noticias">Noticias</a>
			<a href="../calendario.html" title="calendario">Calendario</a>
			<a href="../meteorologia.html" title="meteorología">Meteorología</a>
			<a href="../circuito.html" title="circuito">Circuito</a>
			<a href="viajes.php" title="viajes" class="active">Viajes</a>
			<a href="../juegos.html" title="juegos">Juegos</a>
		</nav>
	</header>
	<p>
		Estás en: <a href="../index.html">Inicio</a> >> Viajes
	</p>

	<h2>Viajes</h2>


	<main>
		<section>
			<h3>
				Mapa Estático de Tu Ubicación:
			</h3>
			<button> Cargar Mapa Estático </button>
		</section>
		<section>
			<h3>Mapa Dinámico de Tu Ubicación:</h3>
			<button> Cargar Mapa Dinámico </button>
			<div></div>
		</section>
	</main>

	<?php
	$carrusel = new Carrusel(' Washington D. C.', 'Estados Unidos');
	$carrusel->obtenerImagenesCarrusel();
	$moneda = new Moneda("EUR", "USD");
	$moneda->getExchangeRate();
	?>
</body>

</html>