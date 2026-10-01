-- ========================================================
-- OptiRamos · Datos de ejemplo (oferta piloto MBAn UAI)
-- Generado desde src/data/mockCourses.ts. Ejecutar después de schema.sql.
-- ========================================================

TRUNCATE bloques_horario, secciones, cursos CASCADE;

-- IND-501 · Automatización e IA para MVPs
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('IND-501', 'Automatización e IA para MVPs', 6, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Benjamín Happey', 12 FROM cursos WHERE codigo = 'IND-501'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Martes', '08:30', '10:00', 'A-201'),
  ('Jueves', '08:30', '10:00', 'A-201')
) AS b(dia, hora_inicio, hora_fin, sala);
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 2, 'Benjamín Happey', 5 FROM cursos WHERE codigo = 'IND-501'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Martes', '10:15', '11:45', 'A-202'),
  ('Jueves', '10:15', '11:45', 'A-202')
) AS b(dia, hora_inicio, hora_fin, sala);

-- FIN-602 · Finanzas Corporativas Avanzadas
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('FIN-602', 'Finanzas Corporativas Avanzadas', 6, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Carlos Mendoza', 8 FROM cursos WHERE codigo = 'FIN-602'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Martes', '10:15', '11:45', 'B-104'),
  ('Jueves', '10:15', '11:45', 'B-104')
) AS b(dia, hora_inicio, hora_fin, sala);
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 2, 'Laura Prieto', 15 FROM cursos WHERE codigo = 'FIN-602'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Lunes', '08:30', '10:00', 'B-105'),
  ('Miércoles', '08:30', '10:00', 'B-105')
) AS b(dia, hora_inicio, hora_fin, sala);

-- MKT-503 · Marketing Estratégico & Analytics
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('MKT-503', 'Marketing Estratégico & Analytics', 5, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Andrea Silva', 20 FROM cursos WHERE codigo = 'MKT-503'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Lunes', '10:15', '11:45', 'C-301'),
  ('Miércoles', '10:15', '11:45', 'C-301')
) AS b(dia, hora_inicio, hora_fin, sala);
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 2, 'Felipe Morales', 14 FROM cursos WHERE codigo = 'MKT-503'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Martes', '14:00', '15:30', 'C-302'),
  ('Jueves', '14:00', '15:30', 'C-302')
) AS b(dia, hora_inicio, hora_fin, sala);

-- OPE-504 · Gestión de Operaciones & Supply Chain
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('OPE-504', 'Gestión de Operaciones & Supply Chain', 6, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Roberto Gómez', 9 FROM cursos WHERE codigo = 'OPE-504'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Martes', '12:00', '13:30', 'A-108'),
  ('Jueves', '12:00', '13:30', 'A-108')
) AS b(dia, hora_inicio, hora_fin, sala);
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 2, 'Patricia Torres', 18 FROM cursos WHERE codigo = 'OPE-504'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Lunes', '14:00', '15:30', 'A-109'),
  ('Miércoles', '14:00', '15:30', 'A-109')
) AS b(dia, hora_inicio, hora_fin, sala);

-- EST-505 · Estadística Aplicada & Machine Learning
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('EST-505', 'Estadística Aplicada & Machine Learning', 6, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Gonzalo Valdés', 10 FROM cursos WHERE codigo = 'EST-505'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Lunes', '12:00', '13:30', 'Lab-4'),
  ('Miércoles', '12:00', '13:30', 'Lab-4')
) AS b(dia, hora_inicio, hora_fin, sala);

-- ECO-506 · Economía de Empresas & Mercados
INSERT INTO cursos (codigo, nombre, creditos, carrera) VALUES ('ECO-506', 'Economía de Empresas & Mercados', 5, 'MBAn Trimestre 2');
WITH sec AS (
  INSERT INTO secciones (curso_id, numero_seccion, profesor, cupos_disponibles)
  SELECT id, 1, 'Matías Zúñiga', 16 FROM cursos WHERE codigo = 'ECO-506'
  RETURNING id
)
INSERT INTO bloques_horario (seccion_id, dia, hora_inicio, hora_fin, sala)
SELECT sec.id, b.dia, b.hora_inicio::time, b.hora_fin::time, b.sala FROM sec, (VALUES
  ('Viernes', '08:30', '11:45', 'B-201')
) AS b(dia, hora_inicio, hora_fin, sala);
