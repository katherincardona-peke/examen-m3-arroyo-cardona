-- db/schema.sql — base de datos de ms-salones
SET NAMES utf8mb4;

CREATE TABLE salones (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  salon_id             INT NOT NULL,
  codigo_salon         VARCHAR(20) NOT NULL,
  edificio             VARCHAR(60) NOT NULL,
  capacidad            INT NOT NULL
);

INSERT INTO salones (salon_id, codigo_salon, edificio, capacidad) VALUES
  (1, 'A-101', 'Edificio Central', 40),
  (2, 'B-204', 'Ingenierías', 25),
  (3, 'C-310', 'Ciencias Básicas', 60),
  (4, 'L-002', 'Laboratorios', 18);