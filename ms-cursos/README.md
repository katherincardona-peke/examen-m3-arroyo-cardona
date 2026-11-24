# ms-cursos · Contrato de la API

Microservicio de **cursos** del examen del Módulo 3 (Redes y Servicios Multimedia). Puerto: **3011**.
Consume al microservicio **proveedor ms-salones** (puerto 3012) para validar y componer el salón de cada curso.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL/MariaDB, ms-usuarios (3001) y ms-salones (3012) corriendo.

1. Como root en MySQL:

```sql
CREATE DATABASE cursos_db CHARACTER SET utf8mb4;
CREATE USER 'cursos_user'@'localhost' IDENTIFIED BY 'Cursos2026*';
GRANT ALL PRIVILEGES ON cursos_db.* TO 'cursos_user'@'localhost';
FLUSH PRIVILEGES;
```

2. `mysql -u cursos_user -p cursos_db < db/schema.sql` (borra y recrea la tabla con los 4 cursos iniciales)
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios** y
   `SALONES_URL` la dirección de ms-salones.
5. `npm run dev`

## Representación

```json
{
  "id": 1, "codigo": "RED-301", "nombre": "Redes y Servicios Multimedia",
  "creditos": 3, "cupo": 30, "semestre": "2026-2", "salon_id": 1,
  "salon": { "id": 1, "codigo_salon": "A-101", "edificio": "Edificio Central" }
}
```

## Atributos

| Atributo | Tipo | Reglas |
|---|---|---|
| id | entero | Lo asigna la base de datos |
| codigo | texto | Obligatorio, único. Se guarda en mayúsculas |
| nombre | texto | Obligatorio |
| creditos | entero | Entre 1 y 6 |
| cupo | entero | Mayor que 0. **No puede superar la capacidad del salón** |
| semestre | texto | Formato `AAAA-1` o `AAAA-2` |
| **salon_id** | **entero** | **Obligatorio, entero positivo. Id del salón en ms-salones (atributo de referencia)** |

En las respuestas de GET (y de POST y PUT) se agrega el objeto compuesto `salon: { id, codigo_salon, edificio }`.

## Relación con ms-salones

| Situación | Respuesta de ms-cursos |
|---|---|
| `salon_id` no existe en ms-salones (al crear o actualizar) | **400** |
| ms-salones no responde (al crear o actualizar) | **503** |
| ms-salones responde con un error inesperado | **502** |
| `cupo` > `capacidad` del salón (al crear o actualizar) | **400** (regla de negocio) |
| ms-salones no responde en un GET | **200** con `salon: null` y `aviso` |

- El token del usuario (`Authorization`) se reenvía a ms-salones.
- El cliente está en `src/clients/salones.client.js`.
- `GET /cursos/:id` y `GET /cursos` hacen **una sola** petición `GET /salones?ids=…` a ms-salones.

## Seguridad

Todas las rutas exigen `Authorization: Bearer <token>` (de `POST /usuarios/login` de ms-usuarios).

| Operación | Roles |
|---|---|
| GET | Cualquier rol |
| POST, PUT, DELETE | Solo `administrador` |

## Endpoints

| Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|
| GET | /health | 200 | — |
| GET | /cursos | 200 arreglo (con `salon`) | 400 · 401 |
| GET | /cursos?semestre=2026-2 | 200 | 400 · 401 |
| GET | /cursos?ids=1,2,3 | 200 | 400 · 401 |
| GET | /cursos/:id | 200 curso (con `salon`) | 400 · 401 · 404 |
| POST | /cursos | 201 + `Location` | 400 · 401 · 403 · 409 · 502 · 503 |
| PUT | /cursos/:id | 200 | 400 · 401 · 403 · 404 · 409 · 502 · 503 |
| DELETE | /cursos/:id | 204 | 400 · 401 · 403 · 404 |

### Cuerpo de POST y PUT

```json
{ "codigo": "ELE-110", "nombre": "Electrónica Básica", "creditos": 3, "cupo": 20, "semestre": "2026-2", "salon_id": 1 }
```

## Pruebas

`docs/ms-cursos.postman_collection.json` trae el login del administrador (guarda el token) y los 8 casos
de la ficha 02. Los casos 07 y 08 se ejecutan con ms-salones detenido. Para probar por el host virtual
solo se cambian las variables `base` (`http://<apellidos>-f2.m3examen.com/api`) y `login`.
