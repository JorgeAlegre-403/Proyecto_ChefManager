<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/chef-hat.svg" alt="TraceFood Logo" width="80" height="80">
  <h1 align="center">TraceFood</h1>
  <p align="center">
    <strong>Sistema Integral de Trazabilidad y Gestión de Almacenes para Cocinas Profesionales</strong>
  </p>
  <p align="center">
    <a href="#-presentación-del-proyecto">Presentación</a> •
    <a href="#-características">Características</a> •
    <a href="#-stack-tecnológico">Stack Tecnológico</a> •
    <a href="#-documentación-y-manuales">Documentación</a> •
    <a href="#-instalación-y-despliegue">Instalación</a>
  </p>
</div>

---

## 👨‍🍳 Presentación del Proyecto

**TraceFood** nació de la necesidad real de modernizar la gestión interna de los restaurantes. Las cocinas profesionales manejan diariamente enormes volúmenes de materias primas, y el control manual en papel o Excel conlleva pérdidas económicas por caducidades no detectadas (mermas) e incongruencias ante posibles inspecciones de Sanidad.

El proyecto **TraceFood** ofrece a los equipos gastronómicos una herramienta unificada para:
- **Digitalizar la Recepción de Mercancías**: Registrando ingredientes, lotes, proveedores y caducidades al instante.
- **Mejorar la Rentabilidad**: Reduciendo el desperdicio mediante alertas de caducidad temprana.
- **Automatizar la Planificación**: Creando menús basados en los productos que corren el riesgo de echarse a perder (metodología *First Expired, First Out*).
- **Proteger al Consumidor**: Gracias a una trazabilidad inversa inmediata y precisa.

---

## ✨ Características Principales

- 📦 **Registro Dinámico de Productos**: Ingreso rápido de mercancías (proveedor, lote, zona de almacén).
- 🧭 **Mapa de Almacén**: Organización visual (cámaras frigoríficas, cuarto frío, secos) según las condiciones de cada alimento.
- 📆 **Planificador de Menús Automático**: Asistente que propone usos de inventario bajo normativa de seguridad alimentaria.
- 🔔 **Sistema de Alertas Visuales**: Notificaciones inmediatas sobre productos cercanos a su límite de consumo.
- 📱 **Diseño "Mobile First" Premium**: Interfaz moderna, altamente responsiva para su uso intensivo en tablets dentro de las zonas de cocina.

---

## 🛠 Stack Tecnológico

El proyecto ha adoptado la arquitectura "Modern Frontend" combinada con servicios Backend-as-a-Service, garantizando rendimiento y escalabilidad.

| Tecnología | Rol en el Proyecto |
| :--- | :--- |
| **[React (v19)](https://react.dev/) + [Vite](https://vitejs.dev/)** | Motor central del Frontend. Renderizado ultrarrápido y desarrollo ágil. |
| **[Tailwind CSS (v4)](https://tailwindcss.com/)** | Estilización atómica para un diseño *premium*, fluido y totalmente responsivo. |
| **[Zustand](https://zustand-demo.pmnd.rs/)** | Manejo del Estado Global (State Management). Mantiene la sincronización de inventarios, carrito interno y menús sin prop-drilling. |
| **[Supabase](https://supabase.com/)** | Base de Datos (PostgreSQL), Autenticación y Backend Serverless fluido y real-time. |
| **[React Router](https://reactrouter.com/)** | Gestión segura del enrutamiento de páginas (Dashboard, Inventario, Login). |
| **[Framer Motion](https://www.framer.com/motion/)** | Librería líder para micro-animaciones en transiciones de layout y scroll. |

---

## 📚 Documentación y Manuales

La documentación académica y operativa del proyecto **ha sido estructurada de forma externa** para su correcta lectura. Toda la información profunda, requisitos y análisis de diseño se encuentra alojada en el directorio [`/Proyecto_Trazabilidad/manuales/`](./Proyecto_Trazabilidad/manuales/).

> **Nota para evaluación**: En la carpeta indicada encontrarás 4 documentos completos (`.pdf` y `.md`):

1. 📄 **Manual_de_Usuario**: Funcionamiento general, pantallas, dashboard, logueo y uso práctico por parte del Jefe de Cocina/Cocinero.
2. ⚙️ **Manual_Tecnico**: Arquitectura requerida, requisitos (Funcionales y No Funcionales), stack y estructura de BBDD relacional (roles).
3. 🚀 **Manual_de_Despliegue**: Instrucciones precisas de infraestructura, clones y compilación final.
4. 📂 **Manual_del_Proyecto**: Resumen del desarrollo durante los trimestres del curso, metas alcanzadas, problemas técnicos solventados y justificación del modelo.

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/JorgeAlegre-403/Proyecto_Trazabilidad.git
```

### 2. Navegar a la carpeta React
```bash
cd Proyecto_Trazabilidad/Proyecto_Trazabilidad
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno (.env)
Deberás crear un archivo `.env` en la raíz insertando las claves API proporcionadas por Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 5. Arrancar el servidor de desarrollo
```bash
npm run dev
```

---

<div align="center">
  <p>Construido con ❤️ para hacer las cocinas más simples, eficientes y seguras.</p>
</div>
