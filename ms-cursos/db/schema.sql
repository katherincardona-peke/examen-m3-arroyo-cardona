-- db/schema.sql — base de datos de ms-cursos
SET NAMES utf8mb4;            -- para que las tildes y la ñ se guarden bien

CREATE TABLE cursos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(20)  NOT NULL UNIQUE,                     -- regla: código único (409)
  nombre    VARCHAR(120) NOT NULL,
  creditos  INT          NOT NULL CHECK (creditos BETWEEN 1 AND 6),
  cupo      INT          NOT NULL CHECK (cupo > 0),
  semestre  VARCHAR(6)   NOT NULL                             -- formato AAAA-1 o AAAA-2
);

-- Registros iniciales
INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre) VALUES
  ('RED-301', 'Redes y Servicios Multimedia', 3, 30, '2026-2'),
  ('MAT-201', 'Cálculo Integral',             4, 40, '2026-2'),
  ('FIS-202', 'Física 2',                     4, 35, '2026-1'),
  ('PRO-101', 'Programación Básica',          3, 25, '2026-1');
