# ms-salones · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de cursos, que guarda el atributo `salon_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE salones_db;
CREATE USER 'salones_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON salones_db.* TO 'salones_user'@'localhost';
```

2. `mysql -u salones_user -p salones_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "codigo_salon": "A-101", "edificio": "Edificio Central", "capacidad": 40}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| codigo_salon | texto |
| edificio | texto |
| capacidad | entero |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /salones | 200 arreglo | 401 |
| Consultar por lotes | GET | /salones?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /salones/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | codigo_salon | edificio | capacidad |
|---|---|---|---|
| 1 | A-101 | Edificio Central | 40 |
| 2 | B-204 | Ingenierías | 25 |
| 3 | C-310 | Ciencias Básicas | 60 |
| 4 | L-002 | Laboratorios | 18 |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `salones.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-cursos/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-cursos y ms-salones. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/cursos` y `/api/salones` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-cursos | `GET /salones/:id` (validar) · `GET /salones?ids=…` (componer) |
