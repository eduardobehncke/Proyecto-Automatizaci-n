-- ========================================================
-- OptiRamos · Esquema de Base de Datos para Supabase (Postgres)
-- ========================================================

-- 1. Tabla de Cursos / Asignaturas
CREATE TABLE IF NOT EXISTS cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT DEFAULT 6,
    carrera VARCHAR(100) DEFAULT 'MBAn UAI'
);

-- 2. Tabla de Secciones por Curso
CREATE TABLE IF NOT EXISTS secciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    numero_seccion INT NOT NULL,
    profesor VARCHAR(150) NOT NULL,
    cupos_totales INT DEFAULT 30,
    cupos_disponibles INT DEFAULT 30
);

-- 3. Tabla de Bloques de Horario por Sección
CREATE TABLE IF NOT EXISTS bloques_horario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seccion_id UUID REFERENCES secciones(id) ON DELETE CASCADE,
    dia VARCHAR(20) NOT NULL, -- Ej: 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'
    hora_inicio TIME NOT NULL, -- Ej: '08:30:00'
    hora_fin TIME NOT NULL,    -- Ej: '10:00:00'
    sala VARCHAR(50) DEFAULT 'Por asignar'
);

-- 4. Tabla de Registros / Logs de Optimización (Persistencia Capa 1 & 2)
CREATE TABLE IF NOT EXISTS optimizaciones_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    usuario_email VARCHAR(150),
    ramos_solicitados JSONB NOT NULL,
    restricciones JSONB NOT NULL,
    horarios_generados JSONB NOT NULL,
    tiempo_ejecucion_ms INT
);

-- Habilitar RLS (Row Level Security) para Capa 2 BBDD
ALTER TABLE optimizaciones_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Logs: la app (rol anon) solo puede INSERTAR; no puede leer logs de otros usuarios.
DROP POLICY IF EXISTS "anon_inserta_logs" ON optimizaciones_log;
CREATE POLICY "anon_inserta_logs" ON optimizaciones_log
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Catálogo académico: lectura pública, escritura solo desde el panel / service_role.
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE secciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloques_horario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lectura_publica_cursos" ON cursos;
CREATE POLICY "lectura_publica_cursos" ON cursos FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "lectura_publica_secciones" ON secciones;
CREATE POLICY "lectura_publica_secciones" ON secciones FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "lectura_publica_bloques" ON bloques_horario;
CREATE POLICY "lectura_publica_bloques" ON bloques_horario FOR SELECT TO anon, authenticated USING (true);
