-- 1. Creamos un tipo ENUM para manejar los estados de los reclamos.
-- Esto se mantiene ya que la tabla 'reclamos' lo utiliza.
CREATE TYPE public.estado_reclamo AS ENUM (
    'nuevo',
    'clasificado',
    'asignado',
    'en_progreso',
    'resuelto',
    'cerrado'
);

-- 2. Tabla de Reclamos (MODIFICADA)
-- Esta es la única tabla principal que almacena cada reclamo.
-- Las tablas 'clientes', 'empleados' y 'categorias' han sido eliminadas.
CREATE TABLE public.reclamos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo text,
    correo_cliente text,
    -- Datos del formulario
    descripcion TEXT NOT NULL,
    fecha_reclamo TIMESTAMPTZ NOT NULL, -- Fecha que reporta el cliente

    -- NUEVO: Categoría como un string (TEXT).
    -- Ya no es una Foreign Key a una tabla 'categorias'.
    categoria TEXT, 
    
    -- Columna de estado para el flujo de trabajo
    estado public.estado_reclamo DEFAULT 'nuevo',
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar Row Level Security (RLS)
-- Se habilita RLS solo para la tabla restante.
ALTER TABLE public.reclamos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS
-- Política para la inserción desde el formulario web (clave anónima).
CREATE POLICY "Permitir inserción anónima de reclamos"
ON public.reclamos FOR INSERT
TO anon
WITH CHECK (true);

-- Todo el código relacionado con las tablas 'clientes', 'empleados', 'categorias'
-- y la función 'obtener_empleado_disponible' ha sido eliminado 
-- según la solicitud.