CREATE TABLE public.categorias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying NOT NULL UNIQUE,
  CONSTRAINT categorias_pkey PRIMARY KEY (id)
);
CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL UNIQUE,
  direccion text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.empleados (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL UNIQUE,
  categoria_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT empleados_pkey PRIMARY KEY (id),
  CONSTRAINT empleados_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id)
);
CREATE TABLE public.reclamos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL,
  categoria_id uuid,
  asignado_a uuid,
  descripcion text NOT NULL,
  fecha_reclamo timestamp with time zone NOT NULL,
  estado USER-DEFINED DEFAULT 'nuevo'::estado_reclamo,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reclamos_pkey PRIMARY KEY (id),
  CONSTRAINT reclamos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id),
  CONSTRAINT reclamos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id),
  CONSTRAINT reclamos_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES public.empleados(id)
);
