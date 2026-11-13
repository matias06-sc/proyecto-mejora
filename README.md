# D’Lu Store

Catálogo web de productos tecnológicos para D’Lu Store. La aplicación permite explorar y filtrar productos, consultar sus detalles, gestionar un carrito y pagar online con Mercado Pago. Está construida con React, TypeScript y Vite, y puede conectarse a Supabase para leer el catálogo y registrar pedidos.

## Requisitos

- Node.js y npm
- Un proyecto de Supabase para habilitar la conexión y los pagos online

## Instalación

Clona el repositorio, entra en la carpeta e instala las dependencias:

```bash
npm install
```

Para ejecutar la aplicación en desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir en el navegador.

## Configuración de Supabase

Crea un archivo `.env.local` en la raíz del proyecto con las credenciales de tu proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
```

La aplicación usa estas variables para conectar con Supabase. Si no están configuradas, muestra el catálogo de demostración incluido en el frontend.

### Aplicar las migraciones a Supabase

Se usa Supabase CLI para aplicar las migraciones versionadas de `supabase/migrations/` al proyecto remoto. Instala la CLI siguiendo la [guía oficial](https://supabase.com/docs/guides/cli) y, desde la raíz del repositorio, autentícate y enlaza el proyecto:

```bash
npx supabase login
npx supabase link --project-ref tu-project-ref
```

La CLI pedirá las credenciales de acceso necesarias de forma interactiva. No las pegues en el código, en el README ni en el chat. El `project-ref` se encuentra en la URL o en la configuración del proyecto en el Dashboard de Supabase.

Antes de modificar la base remota, revisa qué migraciones se aplicarían:

```bash
npx supabase db push --remote --dry-run
```

Si el resultado es correcto y corresponde al proyecto deseado, aplica las migraciones:

```bash
npx supabase db push --remote
npx supabase migration list --remote
```

La CLI las ejecuta en orden por su prefijo de fecha:

1. `20261024005300_create_dlu_catalog.sql`: crea las tablas del catálogo y sus políticas de seguridad.
2. `20261024005419_seed_dlu_demo_catalog.sql`: agrega categorías, marcas y productos de demostración. Esta migración no reemplaza ni elimina datos existentes.
3. `20261113000000_create_orders_and_payments.sql`: crea los pedidos y la aplicación de pagos de Mercado Pago.
4. `20261113001000_remove_admin_access.sql`: elimina el historial administrativo y los permisos de escritura para clientes autenticados.

La migración remota debe ejecutarse desde un entorno con la CLI instalada y acceso autorizado al proyecto. No uses una clave `service_role` en el frontend.

## Funcionalidades

- Catálogo público con búsqueda por nombre, SKU o marca.
- Filtro por categoría y vista de detalles de producto.
- Carrito de compras y pago online con Mercado Pago (tarjetas y Yape).
- Página de resultado del pago con estados aprobado, pendiente y fallido.
- Diseño adaptable a pantallas móviles y de escritorio.

## Comandos

```bash
npm run dev        # Inicia el servidor de desarrollo
npm run build      # Genera la versión de producción en dist/
npm run preview    # Previsualiza la compilación de producción
npm run lint       # Ejecuta ESLint
npm run typecheck  # Comprueba los tipos de TypeScript
```

## Tecnologías

- React 18 y TypeScript
- Vite
- Tailwind CSS
- Supabase (base de datos y Edge Functions)
- Lucide React (iconos)
