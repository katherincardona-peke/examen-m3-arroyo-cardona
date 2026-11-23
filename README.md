# ms-cursos

Redes y Servicios Multimedia · UAO · Evaluación Módulo 3.
Microservicio que gestiona los **cursos** (código, nombre, créditos, cupo y semestre).
Arquitectura en capas: `routes → controller → service → repository`, con el modelo (`models/curso.js`) y `HttpError`.

Pareja: Araly Arroyo Garcés · Katherin Vanessa Cardona Salamanca

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y **ms-usuarios** corriendo en el puerto 3001 (de ahí sale el token).

1. Crear la base de datos y su usuario (como root):

```sql
CREATE DATABASE cursos_db;
CREATE USER 'cursos_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON cursos_db.* TO 'cursos_user'@'localhost';
```

2. Crear la tabla y los registros iniciales con `db/schema.sql`:

```
mysql -u root cursos_db < db/schema.sql
```

3. `npm install`
4. Copiar `.env.example` como `.env` y ajustar la clave de la base y el `JWT_SECRET` (el mismo de ms-usuarios).
5. `npm run dev` → `ms-cursos escuchando en http://127.0.0.1:3011`

Cada petición recibida se registra en la terminal con el método, la ruta y el código de respuesta, por ejemplo:

```
GET /cursos?semestre=2026-2 -> 200
POST /cursos -> 409
```

## El recurso Curso

| Campo | Tipo | Regla |
|---|---|---|
| id | entero | Lo asigna la base de datos |
| codigo | texto | Obligatorio y **único** (si se repite → 409). Se guarda en mayúsculas |
| nombre | texto | Obligatorio |
| creditos | entero | Entre 1 y 6 |
| cupo | entero | Mayor que 0 |
| semestre | texto | Formato `AAAA-1` o `AAAA-2` (por ejemplo `2026-2`) |

Ejemplo:

```json
{ "id": 1, "codigo": "RED-301", "nombre": "Redes y Servicios Multimedia", "creditos": 3, "cupo": 30, "semestre": "2026-2" }
```

## Seguridad

Todas las rutas exigen la cabecera `Authorization: Bearer <token>`, con el token que entrega
`POST /usuarios/login` de ms-usuarios. El token se verifica con `JWT_SECRET` (`src/middlewares/auth.js`,
copiado sin cambios de ms-usuarios).

| Operación | Roles |
|---|---|
| GET (listar, filtrar, por id) | Cualquier rol |
| POST, PUT, DELETE | Solo `administrador` |

## Endpoints

| Método | URI | Quién | Respuesta exitosa | Errores |
|---|---|---|---|---|
| GET | /health | Público | 200 `{ servicio, estado }` | — |
| GET | /cursos | Cualquier rol | 200 arreglo de cursos | 400 · 401 |
| GET | /cursos?semestre=2026-2 | Cualquier rol | 200 cursos de ese semestre | 400 formato inválido · 401 |
| GET | /cursos?ids=1,2,3 | Cualquier rol | 200 cursos con esos id | 400 · 401 |
| GET | /cursos/:id | Cualquier rol | 200 curso | 400 · 401 · 404 |
| POST | /cursos | administrador | 201 curso + cabecera `Location` | 400 · 401 · 403 · 409 |
| PUT | /cursos/:id | administrador | 200 curso actualizado | 400 · 401 · 403 · 404 · 409 |
| DELETE | /cursos/:id | administrador | 204 sin cuerpo | 400 · 401 · 403 · 404 |

### Cuerpo de POST y PUT

```json
{ "codigo": "ELE-110", "nombre": "Electrónica Básica", "creditos": 3, "cupo": 20, "semestre": "2026-2" }
```

En PUT se envían todos los campos. El código puede quedar igual, pero no puede ser el de otro curso (409).

### Formato de los errores

```json
{ "error": "Datos inválidos", "detalles": ["creditos debe ser un entero entre 1 y 6"] }
```

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos, JSON mal formado, id no numérico o filtro con formato inválido |
| 401 | Falta el token, o es inválido o vencido |
| 403 | El rol no tiene permiso (POST, PUT o DELETE sin ser administrador) |
| 404 | No existe el curso con ese id, o la ruta no existe |
| 409 | Ya existe un curso con ese código |

## Pruebas

La colección de Postman está en `docs/ms-cursos.postman_collection.json`. Trae los inicios de sesión
(administrador y un rol sin permisos) y un caso por cada código de respuesta.
Los inicios de sesión guardan el token en las variables de la colección, así que se puede ejecutar
completa con el **Runner** de Postman. Para probar a través del gateway solo se cambian las variables
`base` y `login`.
