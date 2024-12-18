<?php
class Record
{
	private $server;
	private $user;
	private $pass;
	private $dbName;
	public function __construct()
	{
		$this->server = "localhost";
		$this->user = "DBUSER2024";
		$this->pass = "DBPSWD2024";
		$this->dbName = "records";


	}


	public function saveRecord($nombre, $apellidos, $nivel, $tiempo)
	{
		$mysqli = new mysqli($this->server, $this->user, $this->pass, $this->dbName);
		if ($mysqli->connect_error) {
			die("Conexión fallida: " . $mysqli->connect_error);
		}
		$mysqli->begin_transaction();
		$stmt = $mysqli->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
		if ($stmt === false) {
			die("Error en la preparación de la consulta: " . $mysqli->error);
		}

		$nivel = round($nivel, 1);
		$stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
		$stmt->execute();
		if ($stmt === false) {
			$mysqli->rollback();
			die("Error en la ejecución de la consulta: " . $mysqli->error);
		} else {
			$mysqli->commit();
		}
		$stmt->close();
		$mysqli->close();
	}

	public function getTopRecords($nivel)
	{
		$mysqli = new mysqli($this->server, $this->user, $this->pass, $this->dbName);
		if ($mysqli->connect_error) {
			die("Conexión fallida: " . $mysqli->connect_error);
		}

		$query = "SELECT nombre, apellidos, tiempo FROM registro WHERE ROUND(nivel, 1) = ? ORDER BY tiempo ASC LIMIT 10";
		$stmt = $mysqli->prepare($query);
		if ($stmt === false) {
			die("Error en la preparación de la consulta: " . $mysqli->error);
		}


		$stmt->bind_param("d", $nivel);
		$stmt->execute();
		$result = $stmt->get_result();
		echo "<section>";
		echo "<h4>Clasificación:</h4>";
		echo "<ol>";
		$row_count = 0;
		while ($row = $result->fetch_assoc()) {
			echo "<li>{$row['nombre']} {$row['apellidos']} - {$row['tiempo']} segundos</li>";
			$row_count++;
		}
		echo "</ol>";
		if ($row_count === 0) {
			echo "No se encontraron registros.";
		}
		echo "</section>";
		$stmt->close();
		$mysqli->close();
	}
}


?>
<!DOCTYPE HTML>

<html lang="es">

<head>
	<!-- Datos que describen el documento -->
	<meta charset="UTF-8" />
	<title>F1 Desktop-Semaforo</title>
	<meta name="author" content="Zinedine Alvarez" />
	<meta name="description" content="Juego de reacción del proyecto F1" />
	<meta name="keywords" content="juego,reacción,semáforo, javascript, php" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css" />
	<link rel="icon" href="../multimedia/imagenes/favicon.ico" />
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script src="../js/semaforo.js"></script>
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
			<a href="viajes.php" title="viajes">Viajes</a>
			<a href="../juegos.html" title="juegos" class="active">Juegos</a>
		</nav>
	</header>
	<p>
		Estás en: <a href="../index.html">Inicio</a> >> <a href="../juegos.html">Juegos</a> >> Semáforo
	</p>
	<h2>Menú de Juegos</h2>
	<ul>
		<li><a href="../memoria.html">Juego De Memoria</a></li>
		<li><a href="semaforo.php">Juego De Reacción</a></li>
		<li><a href="../api.html">Api</a></li>
		<li><a href="libre.php">Ejercicio Libre PHP</a></li>
	</ul>
	<main>

	</main>
	<script>
		const semaforo = new Semaforo();

	</script>
	<?php
	$record = new Record();

	if (count($_POST) > 0) {
		$record->saveRecord($_POST['name'], $_POST['surname'], $_POST['level'], $_POST['time']);
		$record->getTopRecords($_POST['level']);
	}

	?>
</body>

</html>