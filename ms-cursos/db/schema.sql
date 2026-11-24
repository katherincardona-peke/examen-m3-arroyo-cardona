-- db/schema.sql — base de datos de ms-cursos
SET NAMES utf8mb4;

DROP TABLE IF EXISTS cursos;

CREATE TABLE cursos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(20)  NOT NULL UNIQUE,
  nombre    VARCHAR(100) NOT NULL,
  creditos  INT          NOT NULL,
  cupo      INT          NOT NULL,
  semestre  VARCHAR(6)   NOT NULL,
  salon_id  INT          NOT NULL   -- id del salón en ms-salones (sin llave foránea: está en otra base)
);

-- salon_id 1 = A-101 (capacidad 40) · salon_id 3 = C-310 (capacidad 60)
INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre, salon_id) VALUES
  ('RED-301', 'Redes y Servicios Multimedia', 3, 30, '2026-2', 1),
  ('MAT-201', 'Cálculo Integral',             4, 35, '2026-2', 1),
  ('FIS-202', 'Física 2',                     3, 40, '2026-1', 3),
  ('PRO-101', 'Programación Básica',          3, 25, '2026-1', 3);
