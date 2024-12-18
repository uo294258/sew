<?php
class Formula1DataBase
{
	private $server;
	private $user;
	private $pass;
	private $dbName;

	private $mysqli;

	public function __construct()
	{
		$this->server = "localhost";
		$this->user = "DBUSER2024";
		$this->pass = "DBPSWD2024";
		$this->dbName = "records";
		$this->mysqli = new mysqli($this->server, $this->user, $this->pass, $this->dbName);
		if ($this->mysqli->connect_error) {
			die("Connection failed: " . $this->mysqli->connect_error);
		}

	}

	public function crearBaseDatos()
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows > 0) {
			echo "<p>La base de datos 'formula1' ya existe.</p>";
			return;
		}
		$sql = file_get_contents('inicializarBase.sql');

		if ($this->mysqli->multi_query($sql)) {
			do {
				if ($result = $this->mysqli->store_result()) {
					$result->free();
				}
			} while ($this->mysqli->more_results() && $this->mysqli->next_result());
			echo "<p>La base de datos 'formula1' ha sido creada con exito.</p>";
		} else {
			echo "Error al crear la base de datos: " . $this->mysqli->error;
		}
	}
	public function eliminarBaseDatos()
	{

		$sql = "DROP DATABASE IF EXISTS formula1";
		if ($this->mysqli->query($sql)) {
			echo "<p>Base de datos 'formula1' eliminada correctamente.</p>";
		} else {
			echo "Error al eliminar la base de datos: " . $this->mysqli->error;
		}
	}
	public function listarDatos()
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");

		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$this->mysqli->select_db("formula1");

		$result = $this->mysqli->query("SHOW TABLES");
		if ($result) {
			echo "<h3>Contenido de la base de datos 'formula1':</h3>";

			while ($row = $result->fetch_array()) {
				$tableName = $row[0];
				echo "<h4>Tabla: $tableName</h4>";

				$data = $this->mysqli->query("SELECT * FROM $tableName");
				if ($data->num_rows > 0) {
					echo "<ul>";
					while ($rowData = $data->fetch_assoc()) {
						echo "<li>";
						foreach ($rowData as $key => $value) {
							if ($key !== 'id') {
								echo "$key: $value | ";
							}
						}
						echo "</li>";
					}
					echo "</ul><br>";
				} else {
					echo "<p>La tabla está vacía.</p>";
				}
			}
		} else {
			echo "Error al listar las tablas: " . $this->mysqli->error;
		}
	}


	public function importarCSV($filename)
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");

		if ($conn->connect_error) {
			echo "<p>La base de datos no ha sido creada.</p>";
		}

		if (($gestor = fopen($filename, "r")) !== FALSE) {
			$tableName = null;
			$values = [];

			while (($data = fgetcsv($gestor, 1000, ",")) !== FALSE) {
				if (isset($data[0]) && strpos($data[0], "table:") === 0) {
					if ($tableName !== null) {
						$this->insertData($conn, $tableName, $values);
					}

					$tableName = substr($data[0], 6);
					$values = [];
					continue;
				}

				if (empty($data[0])) {
					continue;
				}


				$values[] = $data;
			}

			if ($tableName !== null && !empty($values)) {
				$this->insertData($conn, $tableName, $values);
			}

			fclose($gestor);
		} else {
			echo "Error al abrir el archivo.";
		}
	}

	public function insertData($conn, $tableName, $values)
	{
		$query = $this->getInsertQuery($tableName);

		if ($query !== null) {
			$stmt = $conn->prepare($query);

			foreach ($values as $data) {
				switch ($tableName) {
					case 'Circuitos':
						$stmt->bind_param("isssss", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
						break;
					case 'Carreras':
						$stmt->bind_param("issssi", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
						break;
					case 'Equipos':
						$stmt->bind_param("issii", $data[0], $data[1], $data[2], $data[3], $data[4]);
						break;
					case 'Pilotos':
						$stmt->bind_param("issssi", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
						break;
					case 'Resultados':
						$stmt->bind_param("iiissi", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
						break;
					case 'Puntos':
						$stmt->bind_param("iiis", $data[0], $data[1], $data[2], $data[3]);
						break;
					case 'Sponsors':
						$stmt->bind_param("issi", $data[0], $data[1], $data[2], $data[3]);
						break;
				}
				$stmt->execute();
			}
		}
	}

	public function getInsertQuery($tableName)
	{
		switch ($tableName) {
			case 'Circuitos':
				return "INSERT INTO Circuitos (id, nombre, pais, longitud, record_vuelta, capacidad) VALUES (?, ?, ?, ?, ?, ?)";
			case 'Carreras':
				return "INSERT INTO Carreras (id, nombre, fecha, ubicacion, clima, circuito_id) VALUES (?, ?, ?, ?, ?, ?)";
			case 'Equipos':
				return "INSERT INTO Equipos (id, nombre, pais, fundacion, campeonatos_ganados) VALUES (?, ?, ?, ?, ?)";
			case 'Pilotos':
				return "INSERT INTO Pilotos (id, nombre, apellido, nacionalidad, fecha_nacimiento, equipo_id) VALUES (?, ?, ?, ?, ?, ?)";
			case 'Resultados':
				return "INSERT INTO Resultados (id, piloto_id, carrera_id, posicion, tiempo, puntos) VALUES (?, ?, ?, ?, ?, ?)";
			case 'Puntos':
				return "INSERT INTO Puntos (id, piloto_id, temporada, puntos) VALUES (?, ?, ?, ?)";
			case 'Sponsors':
				return "INSERT INTO Sponsors (id, nombre, tipo, equipo_id) VALUES (?, ?, ?, ?)";
			default:
				return null;
		}
	}

	function exportarACSV()
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");

		if (!$conn) {
			die("Conexión fallida: " . mysqli_connect_error());
		}
		$tables = ["Circuitos", "Carreras", "Equipos", "Pilotos", "Resultados", "Puntos", "Sponsors"];

		$filename = "exported_data.csv";
		$output = fopen($filename, 'w');

		foreach ($tables as $tableName) {
			fputcsv($output, ["table:" . $tableName]);

			$tableSql = "SELECT * FROM $tableName";
			$tableResult = mysqli_query($conn, $tableSql);

			if (!$tableResult) {
				die("Error al obtener los datos de la tabla $tableName: " . mysqli_error($conn));
			}

			while ($rowData = mysqli_fetch_assoc($tableResult)) {
				fputcsv($output, $rowData);
			}
			fputcsv($output, []);
		}

		fclose($output);

		mysqli_close($conn);

		echo "<p>Los datos han sido exportados a '$filename'.</p>";
	}
	public function rankingPilotos()
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");
		$stmt = $conn->prepare("SELECT p.id AS piloto_id, p.nombre, p.apellido, p.nacionalidad,p.fecha_nacimiento,  SUM(r.puntos) AS total_puntos
            FROM Pilotos p
            JOIN Resultados r ON p.id = r.piloto_id
            GROUP BY p.id
            ORDER BY total_puntos DESC
            LIMIT 3");
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $nombre, $apellido, $nacionalidad, $fecha_nacimiento, $totalPuntos);
		echo "<section>";

		echo "<h3>Ranking De Pilotos</h3>";
		$position = 1;
		if ($stmt->num_rows > 0) {
			echo "<section>";
			echo "<h4>Pilotos</h4>";
			while ($stmt->fetch()) {
				echo "<article >";
				echo "<h4> Posición " . $position . "</h4>";
				echo "<p>Nombre: " . $nombre . " " . $apellido . "</p>";
				echo "<p>Nacionalidad: " . $nacionalidad . "</p>";
				echo "<p>Fecha de Nacimiento: " . $fecha_nacimiento . "</p>";
				echo "<p>Puntos del Piloto: " . $totalPuntos . "</p>";
				echo "</article>";
				$position++;
			}
			echo "</section>";
		} else {
			echo "<p>No se encontraron pilotos con puntos.</p>";
		}

		echo "</section>";
		$stmt->close();
		$conn->close();
	}

	public function getPilotosPorEquipo($equipoNombre)
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");
		$stmt = $conn->prepare("SELECT id FROM Equipos WHERE nombre = ?");
		$stmt->bind_param("s", $equipoNombre);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows > 0) {
			$stmt->bind_result($equipoId);
			$stmt->fetch();

			$stmt->close();

			$stmt = $conn->prepare("SELECT id, nombre, apellido, nacionalidad, fecha_nacimiento FROM Pilotos WHERE equipo_id = ?");
			$stmt->bind_param("i", $equipoId);
			$stmt->execute();
			$stmt->store_result();

			$stmt->bind_result($id, $nombre, $apellido, $nacionalidad, $fecha_nacimiento);
			echo "<section>";

			echo "<h3>Información de los pilotos del equipo $equipoNombre</h3>";

			if ($stmt->num_rows > 0) {
				echo "<section>";
				echo "<h4>Pilotos</h4>";
				while ($stmt->fetch()) {
					echo "<article >";
					echo "<h4>" . $nombre . " " . $apellido . "</h4>";
					echo "<p>Nacionalidad:" . $nacionalidad . "</p>";
					echo "<p>Fecha de Nacimiento: " . $fecha_nacimiento . "</p>";
					$totalPuntos = $this->getPuntosPorPiloto($id);
					echo "<p>Puntos del Piloto: " . $totalPuntos . "</p>";
					echo "</article>";
				}
				echo "</section>";
			}
			echo "</section>";
			$stmt->close();
		} else {
			echo "<p>No se encontró el equipo '$equipoNombre'.</p>";
		}
	}

	function simularResultadosCarrera()
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");

		if ($conn->connect_error) {
			die("Conexión fallida: " . $conn->connect_error);
		}
		$puntosPorPosicion = array(25, 18, 15, 12, 10, 8, 6, 4, 2, 1);

		$tiemposPorPosicion = array(
			"01:30:00",
			"01:32:00",
			"01:34:00",
			"01:36:00",
			"01:38:00",
			"01:40:00",
			"01:42:00",
			"01:44:00",
			"01:46:00",
			"01:48:00"
		);
		$sqlPilotosAleatorios = "SELECT id, nombre, apellido FROM Pilotos ORDER BY RAND() LIMIT 10";
		$resultPilotosAleatorios = $conn->query($sqlPilotosAleatorios);

		if ($resultPilotosAleatorios->num_rows > 0) {
			$idsPilotosAleatorios = array();

			while ($row = $resultPilotosAleatorios->fetch_assoc()) {
				$idsPilotosAleatorios[] = $row;
			}
		} else {
		}

		$sqlCarrera = "SELECT id FROM Carreras ORDER BY  RAND() ASC LIMIT 1";
		$resultCarrera = $conn->query($sqlCarrera);

		if ($resultCarrera->num_rows > 0) {
			$rowCarrera = $resultCarrera->fetch_assoc();
			$primerIdCarrera = $rowCarrera['id'];
		} else {
			echo "No se encontraron carr eras.";
		}
		echo "<section>";
		echo "<h3>Carrera Finalizada</h3>";
		echo "<ul>";
		for ($i = 1; $i <= 10; $i++) {
			$posicion = $i;
			$puntos = $puntosPorPosicion[$i - 1];
			$tiempo = $tiemposPorPosicion[$i - 1];
			$piloto = $idsPilotosAleatorios[$i - 1];
			$nombre = $piloto['nombre'];
			$apellido = $piloto['apellido'];
			$pilotoId = $piloto['id'];
			$stmt = $conn->prepare("INSERT INTO Resultados (piloto_id, carrera_id, posicion, tiempo, puntos) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param("iiisi", $pilotoId, $primerIdCarrera, $posicion, $tiempo, $puntos);
			$stmt->execute();
			echo "<li>";
			echo "Posición: $posicion, Puntos: $puntos, Tiempo: $tiempo, Carrera: $primerIdCarrera, Nombre: $nombre, Apellido: $apellido";
			echo "</li>";
		}
		echo "</ul>";
		echo "</section>";
		$conn->close();
	}
	public function getPuntosPorPiloto($pilotoId)
	{
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");

		$stmt = $conn->prepare("SELECT SUM(puntos) AS total_puntos FROM Resultados WHERE piloto_id = ?");
		$stmt->bind_param("i", $pilotoId);
		$stmt->execute();
		$stmt->store_result();

		$totalPuntos = 0;

		if ($stmt->num_rows > 0) {
			$stmt->bind_result($totalPuntos);
			$stmt->fetch();
		}
		if (is_null($totalPuntos)) {
			$totalPuntos = 0;
		}
		$stmt->close();
		$conn->close();

		return $totalPuntos;
	}

	function crearPiloto($nombre, $apellido, $nacionalidad, $fecha_nacimiento, $nombreEquipo)
	{
		$result = $this->mysqli->query("SHOW DATABASES LIKE 'formula1'");
		if ($result->num_rows == 0) {
			echo "<p>La base de datos 'formula1' no existe.</p>";
			return;
		}
		$conn = mysqli_connect($this->server, $this->user, $this->pass, "formula1");

		$stmt = $conn->prepare('SELECT nombre, pais, fundacion  FROM Equipos  ORDER BY fundacion ASC LIMIT 1 ');
		$stmt = $conn->prepare("SELECT id FROM Equipos WHERE nombre = ?");
		$stmt->bind_param("s", $nombreEquipo);
		$stmt->execute();
		$stmt->bind_result($equipo_id);
		$stmt->fetch();
		$stmt->close();

		if (!$equipo_id) {
			echo "<p>El equipo '$nombreEquipo' no existe. Por favor, revisa el nombre y vuelve a intentarlo.</p>";
			$conn->close();
			return;
		}
		$stmt = $conn->prepare("INSERT INTO Pilotos (nombre, apellido, nacionalidad, fecha_nacimiento, equipo_id) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $nombre, $apellido, $nacionalidad, $fecha_nacimiento, $equipo_id);

		if ($stmt->execute()) {
			echo "<p>El piloto se ha creado correctamente.</p>";
		} else {
			echo "<p>Error al crear el piloto: " . $stmt->error . "</p>";
		}

		$stmt->close();
		$conn->close();
	}
}


?>
<!DOCTYPE HTML>

<html lang="es">

<head>
	<!-- Datos que describen el documento -->
	<meta charset="UTF-8" />
	<title>F1 Desktop-MYSQLi</title>
	<meta name="author" content="Zinedine Alvarez" />
	<meta name="description" content="Ejercicio libre de uso MYSQLi y PHP" />
	<meta name="keywords" content="mysql, base de datos, php, archivos csv" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/libre_php.css" />
	<link rel="icon" href="../multimedia/imagenes/favicon.ico" />

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
		Estás en: <a href="../index.html">Inicio</a> >> <a href="../juegos.html">Juegos</a> >> Ejercicio Libre PHP
	</p>
	<section>
		<h2>Menú de Juegos</h2>
		<ul>
			<li><a href="../memoria.html">Juego De Memoria</a></li>
			<li><a href="semaforo.php">Juego De Reacción</a></li>
			<li><a href="../api.html">Api</a></li>
			<li><a href="libre.php">Ejercicio Libre PHP</a></li>
		</ul>
	</section>
	<main>
		<section>
			<h2>Gestión de Base de Datos</h2>
			<h3>Opciones:</h3>
			<form method="POST" enctype="multipart/form-data">
				<button type="submit" name="crearBaseDatos">Crear Base de Datos</button>
				<button type="submit" name="eliminarBaseDatos">Eliminar Base de Datos</button>
				<button type="submit" name="listarDatos">Listar Tablas</button>
				<label>Archivo .csv:
					<input type="file" name="csvFile" accept=".csv">
				</label>
				<button type="submit" name="importarCSV">Importar CSV</button>
				<button type="submit" name="exportCSV">Exportar A Archivo CSV</button>
			</form>
		</section>
		<section>
			<h3>Obtener información:</h3>
			<form method="POST">
				<label>Nombre del equipo:
					<input type="text" name="equipo" required>
				</label>
				<button type="submit" name="buscarPilotos">Buscar Pilotos</button>

			</form>
			<form method="POST">
				<button type="submit" name="rankingPilotos">Ranking Pilotos Con Mas Puntos</button>
				<button type="submit" name="simularCarrera">Simular Carrera</button>
			</form>
		</section>
		<section>
			<h3>Crea tu Propio Piloto:</h3>
			<form method="POST">
				<label>Nombre:
					<input type="text" name="nombre" required>
				</label>
				<label>Apellido:
					<input type="text" name="apellido" required>
				</label>
				<label>Nacionalidad:
					<input type="text" name="nacionalidad" required>
				</label>
				<label>Fecha de Nacimiento:
					<input type="date" name="fecha" required>
				</label>
				<label>Equipo:
					<input type="text" name="equipo" required>
				</label>
				<button type="submit" name="creaPiloto">Crear Piloto</button>
			</form>
		</section>
		<?php
		if (count($_POST) > 0) {
			$db = new Formula1DataBase();

			if (isset($_POST['crearBaseDatos'])) {
				$db->crearBaseDatos();
			} elseif (isset($_POST['eliminarBaseDatos'])) {
				$db->eliminarBaseDatos();
			} elseif (isset($_POST['listarDatos'])) {
				$db->listarDatos();
			} elseif (isset($_POST['exportCSV'])) {
				$db->exportarACSV();
			} elseif (isset($_FILES['csvFile'])) {
				if ($_FILES['csvFile']['error'] === UPLOAD_ERR_OK) {
					$csvFile = $_FILES['csvFile']['tmp_name'];
					try {
						$db->importarCSV($csvFile);
					} catch (Exception $e) {
						echo "Error: " . $e->getMessage();
					}
				} else {
					echo "<p>Por favor, selecciona un archivo CSV válido.</p>";
				}
			} else if (isset($_POST['buscarPilotos'])) {
				$equipoNombre = $_POST['equipo'];
				$db->getPilotosPorEquipo($equipoNombre);

			} else if (isset($_POST['creaPiloto'])) {
				$db->crearPiloto($_POST['nombre'], $_POST['apellido'], $_POST['nacionalidad'], $_POST['fecha'], $_POST['equipo']);
			} else if (isset($_POST['rankingPilotos'])) {
				$db->rankingPilotos();
			} else if (isset($_POST['simularCarrera'])) {
				$db->simularResultadosCarrera();
			}
		}
		?>
	</main>

</body>

</html>