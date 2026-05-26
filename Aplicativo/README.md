# 🍽️ TRAZAKITCHEN — Gestión Integral de Cocina

> Aplicación web para facilitar la gestión diaria de una cocina profesional: control de productos, creación de platos y generación de menús.

---

## 📋 Descripción

**TRAZAKITCHEN** es una herramienta diseñada para equipos de cocina que necesitan organizar y centralizar su trabajo diario. Permite gestionar el catálogo de ingredientes y productos, crear fichas de platos con sus composiciones, generar y publicar menús diarios, y administrar los accesos del personal de forma sencilla.

El objetivo es reducir el tiempo dedicado a tareas administrativas y ofrecer una visión clara y actualizada de lo que se tiene disponible en cocina en todo momento.

---

## ✨ Funcionalidades principales

### 🥦 Gestión de Productos / Ingredientes
- Alta, edición y baja de ingredientes y materias primas.
- Clasificación por categorías (proteínas, verduras, lácteos, etc.).
- Registro de información nutricional básica.
- Listado filtrable y con búsqueda en tiempo real.

### 🍲 Gestión de Platos
- Creación de fichas de platos con nombre, descripción e ingredientes.
- Asignación de ingredientes del catálogo a cada plato.
- Generación automática de propuestas de platos a partir del stock disponible.
- Listado y edición de platos existentes.

### 📅 Generación y Gestión de Menús
- Creación de menús diarios compuestos por platos del catálogo.
- Herramienta de generación asistida de menús (primeros, segundos y postres).
- Gestión y edición de los menús guardados.
- **Página pública de menú del día** accesible sin necesidad de autenticación (`/menu-diario`).

### 👥 Administración de Usuarios
- Panel de administración de usuarios del sistema.
- Sistema de roles diferenciados para controlar los accesos:

| Rol | Acceso |
|---|---|
| `jefecocina` | Productos, platos y menús (sin gestión de usuarios) |
| `cocinero` | Solo productos y platos |
| `Administrador de Usuarios` | Solo administración de usuarios |

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| **React + TypeScript** | Interfaz de usuario |
| **Vite** | Bundler y servidor de desarrollo |
| **Supabase** | Base de datos (PostgreSQL), autenticación y API |
| **React Router v6** | Navegación y rutas protegidas |
| **CSS** | Estilos personalizados |

---

## 🗂️ Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Header, Hero, Login…)
├── hooks/            # Hooks personalizados (useRole, etc.)
├── lib/              # Clientes de Supabase (cliente público y admin)
├── pages/            # Páginas principales de la aplicación
│   ├── FormularioPage.tsx      # Alta/edición de ingredientes
│   ├── ListadoPage.tsx         # Listado de ingredientes
│   ├── GenerarPlatosPage.tsx   # Generador asistido de platos
│   ├── PlatosPage.tsx          # Listado y gestión de platos
│   ├── GenerarMenusPage.tsx    # Generador de menús diarios
│   ├── GestionMenusPage.tsx    # Gestión de menús guardados
│   ├── PublicMenuPage.tsx      # Menú del día público
│   └── AdminUsersPage.tsx      # Administración de usuarios
├── services/         # Lógica de acceso a datos (Supabase)
├── styles/           # Estilos globales
└── types/            # Tipos TypeScript compartidos
```

---

## 🚀 Puesta en marcha

### Requisitos previos
- Node.js 18 o superior
- Una cuenta y proyecto en [Supabase](https://supabase.com)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Aplicativo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes claves:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
VITE_SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

> ⚠️ La `SERVICE_ROLE_KEY` se utiliza únicamente en operaciones de administración de usuarios y nunca se expone al cliente final.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔐 Autenticación y roles

El sistema utiliza **Supabase Auth** para la gestión de sesiones. Los roles se almacenan en la tabla `usuarios_app` de la base de datos y se leen mediante el hook `useRole`. Esto permite que el administrador asigne y modifique roles sin necesidad de tocar el código.

Las rutas protegidas redirigen automáticamente al inicio de sesión si el usuario no está autenticado, o a la sección permitida si su rol no tiene acceso a la ruta solicitada.

---

## 🌐 Rutas disponibles

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Landing page | Público |
| `/login` | Inicio de sesión | Público |
| `/menu-diario` | Menú del día | Público |
| `/recuperar-contrasena` | Recuperación de contraseña | Público |
| `/formulario` | Alta/edición de ingredientes | Autenticado |
| `/listado` | Listado de ingredientes | Autenticado |
| `/generar-platos` | Generador de platos | Autenticado |
| `/platos` | Gestión de platos | Autenticado |
| `/generar-menus` | Generador de menús | admin / jefecocina |
| `/gestion-menus` | Gestión de menús | admin / jefecocina |
| `/admin/usuarios` | Administración de usuarios | admin / admin_usuarios |

---

## 📦 Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Vista previa del build
npm run lint      # Análisis estático del código
```

---

## 📄 Licencia

Proyecto de uso interno. Todos los derechos reservados.
