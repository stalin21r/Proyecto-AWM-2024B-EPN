# Proyecto AWM 2024B

### Autores
- Stalin Garcia
- Aldair Flor

### Tecnologías
**Backend:**
- PostgreSQL
- Node.js
- Express

**Frontend:**
- React
- Vite

### Descripción del Proyecto
El proyecto consiste en una aplicación web para la información y gestión de recursos de la asociación de estudiantes de ingeniería electrónica. Consta de:
- Gestor de usuarios
- Casilleros
- Turnos

También consta de una landing page para que los estudiantes en general puedan informarse de noticias, información acerca de la asociación, precios de productos, y stock de casilleros.

### Estructura del Repositorio
El repositorio es un monorepo que contiene tanto el backend como el frontend.

### Instrucciones para Iniciar el Proyecto
1. Situarse sobre el monorepo.
2. Ejecutar `npm install`.
3. Ejecutar `npm run dev`.

Esto levantará tanto el frontend como el backend.

### Configuración del Entorno
Para que funcione, se debe crear un archivo `.env` dentro del backend con la siguiente estructura basada en `envmodel.txt`:

```
SERVER_PORT=
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=
DB_PORT=
DB_SSL=
JWT_SECRET=
```

Se deben setear las configuraciones de conexión a la base de datos.

### Base de Datos
Se provee de un archivo `dbPostgres.sql` para crear la base de datos.