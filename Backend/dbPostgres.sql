CREATE DATABASE aeie_gestor;

\c aeie_gestor;

CREATE SCHEMA private;

-- Tabla de usuarios
CREATE TABLE private.usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    rol BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla de turnos
CREATE TABLE private.turnos (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES private.usuarios (id) ON DELETE CASCADE,
    dia INTEGER CHECK (dia BETWEEN 1 AND 5),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

-- Tabla de asistencia
CREATE TABLE private.asistencia (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES private.usuarios (id) ON DELETE CASCADE,
    dia DATE NOT NULL,
    hora_llegada TIME,
    hora_salida TIME
);

-- Tabla de productos-categorias
CREATE TABLE private.productos_categorias (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de productos
CREATE TABLE private.productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria INTEGER REFERENCES private.productos_categorias (id) ON DELETE CASCADE,
    imagen bytea
);

-- Tabla de bloque
CREATE TABLE private.bloque (
    id SERIAL PRIMARY KEY,
    letra CHAR(1) UNIQUE NOT NULL
);

-- Tabla de casilleros
CREATE TABLE private.casilleros (
    id SERIAL PRIMARY KEY,
    bloque INTEGER REFERENCES private.bloque (id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    ocupado BOOLEAN DEFAULT FALSE,
    propietario VARCHAR(50),
    correo VARCHAR(50),
    telefono VARCHAR(20)
);

-- DROP FUNCTION private.crear_bloque_y_casilleros(bool);

CREATE OR REPLACE FUNCTION private.crear_bloque_y_casilleros(de_derecha_a_izquierda boolean)
 RETURNS integer
 LANGUAGE plperl
AS $function$
    eval {
        my ($de_derecha_a_izquierda) = @_;
        my $letra;
        my $nuevo_bloque_id;
        my $rows = 4;
        my $columns = 5;

        # Obtener la letra del nuevo bloque
        my $sth = spi_exec_query("SELECT MAX(letra::TEXT) as letra FROM private.bloque");
        $letra = $sth->{rows}->[0]->{letra};
        $letra = ($letra eq '') ? 'A' : chr(ord($letra) + 1);

        # Insertar el nuevo bloque
        $sth = spi_exec_query("INSERT INTO private.bloque (letra) VALUES ('$letra') RETURNING id");
        $nuevo_bloque_id = $sth->{rows}->[0]->{id};

        # Crear casilleros
        if ($de_derecha_a_izquierda eq 't') {
            for (my $i = 1; $i <= ($rows * $columns); $i++) {
                elog(INFO, $i);
                spi_exec_query("INSERT INTO private.casilleros (bloque, numero) VALUES ($nuevo_bloque_id, $i)");
            }
        } else {
            for (my $i = 1; $i <= $rows; $i++) {
                for (my $j = 0; $j < $columns; $j++) {
                    my $num = $i + $j * $rows;
                    elog(INFO, $num);
                    spi_exec_query("INSERT INTO private.casilleros (bloque, numero) VALUES ($nuevo_bloque_id, $num)");
                }
            }
        }
        return 1;
    } or do {
        my $error = $@ || 'Unknown error';
        elog(ERROR, "Error al crear bloque y casilleros: $error");
        return 0;
    };
$function$
;

select * from private.usuarios u;

TRUNCATE TABLE private.usuarios RESTART IDENTITY CASCADE;

CREATE VIEW public.vista_turnos AS
SELECT
    t.id,
    u.nombre,
    u.apellido,
    CASE
        WHEN dia = 1 THEN 'Lunes'
        WHEN dia = 2 THEN 'Martes'
        WHEN dia = 3 THEN 'Miércoles'
        WHEN dia = 4 THEN 'Jueves'
        WHEN dia = 5 THEN 'Viernes'
    END AS dia,
    t.hora_inicio,
    t.hora_fin
FROM private.turnos t
    INNER JOIN private.usuarios u ON t.usuario = u.id;

create view public.vista_asistencias as
select a.id, a.usuario, u.nombre, u.apellido, a.dia, a.hora_llegada, a.hora_salida
from private.asistencia a
    inner join private.usuarios u on a.usuario = u.id;

select * from public.vista_asistencias;