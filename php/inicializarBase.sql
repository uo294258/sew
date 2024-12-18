DROP DATABASE IF EXISTS formula1;

CREATE DATABASE formula1;

USE formula1;

CREATE TABLE Circuitos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    longitud DECIMAL(5,2) NOT NULL,
    record_vuelta TIME, 
    capacidad INT 
);

CREATE TABLE Carreras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    ubicacion VARCHAR(50) NOT NULL,
    clima VARCHAR(50), 
    circuito_id INT NOT NULL,
    FOREIGN KEY (circuito_id) REFERENCES Circuitos(id) 
);

CREATE TABLE Equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    fundacion YEAR,
    campeonatos_ganados INT DEFAULT 0
);

CREATE TABLE Pilotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE, 
    equipo_id INT NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES Equipos(id) 
);

CREATE TABLE Resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piloto_id INT NOT NULL,
    carrera_id INT NOT NULL,
    posicion INT NOT NULL,
    tiempo TIME NOT NULL,
    puntos INT NOT NULL,
    FOREIGN KEY (piloto_id) REFERENCES Pilotos(id) ,
    FOREIGN KEY (carrera_id) REFERENCES Carreras(id)
);


CREATE TABLE Sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) ,
    equipo_id INT NOT NULL,
    FOREIGN KEY (equipo_id) REFERENCES Equipos(id) 
);
