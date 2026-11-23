-- db/schema.sql — base de datos de ms-salones
SET NAMES utf8mb4;

CREATE TABLE salones (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  codigo_salon         VARCHAR(20) NOT NULL,
  edificio             VARCHAR(60) NOT NULL,
  capacidad            INT NOT NULL
);

INSERT INTO salones (codigo_salon, edificio, capacidad) VALUES
  ('A-101', 'Edificio Central', 40),
  ('B-204', 'Ingenierías', 25),
  ('C-310', 'Ciencias Básicas', 60),
  ('L-002', 'Laboratorios', 18);
