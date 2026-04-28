<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/chef-hat.svg" alt="TraceFood Logo" width="80" height="80">
  <h1 align="center">TraceFood</h1>
  <p align="center">
    <strong>Sistema Integral de Trazabilidad y Gestión de Almacenes para Cocinas Profesionales</strong>
  </p>
  <p align="center">
    <a href="#presentacion-del-proyecto">Presentación</a> •
    <a href="#caracteristicas-principales">Características</a> •
    <a href="#stack-tecnologico">Stack Tecnológico</a> •
    <a href="#documentacion-y-manuales">Documentación</a> •
    <a href="#instalacion-y-despliegue">Instalación</a>
  </p>
</div>

---

## Presentación del Proyecto

**Proyecto Trazabilidad (TraceFood)**

Aplicación web interna desarrollada como proyecto del ciclo de Desarrollo de Aplicaciones Web (2º DAW), orientada a la gestión de la trazabilidad alimentaria en entornos de hostelería.

El sistema permite a cocineros y jefes de cocina registrar y consultar productos alimentarios, organizar el almacén por zonas, controlar fechas de entrega y caducidad, y planificar menús semanales en función del inventario disponible. La aplicación implementa roles de usuario para diferenciar permisos y responsabilidades, garantizando un uso seguro y organizado de la información.

El proyecto sigue una arquitectura cliente-servidor, utilizando React para el frontend y Supabase (PostgreSQL) como servicio de base de datos. Está enfocado en ofrecer una solución realista, escalable y alineada con la normativa de trazabilidad, aplicando buenas prácticas de desarrollo web, diseño de bases de datos y control de versiones.

Este proyecto ofrece a los equipos gastronómicos una herramienta unificada para:
- **Digitalizar la Recepción de Mercancías**: Registrando ingredientes, lotes, proveedores y caducidades de forma estructurada.
- **Mejorar la Rentabilidad**: Reduciendo el desperdicio mediante la monitorización de caducidades tempranas.
- **Automatizar la Planificación**: Fomentando el uso de productos bajo el riesgo de pérdida comercial (metodología First Expired, First Out).
- **Proteger al Consumidor**: Garantizando una trazabilidad inversa inmediata y precisa.

---

## Características Principales

- **Registro Dinámico de Productos**: Ingreso estructurado de mercancías indicando proveedor, lote y zona de almacén acordes al producto.
- **Mapa de Almacén**: Organización lógica del inventario distribuido en sectores como cámaras frigoríficas, cuartos fríos y almacenamiento en seco.
- **Planificador de Menús (Lógica FEFO)**: Propuesta de uso de inventario guiada por la normativa de seguridad alimentaria vigente.
- **Sistema de Alertas Visuales**: Provisión de notificaciones respecto a productos próximos a superar la fecha límite de consumo óptimo.
- **Diseño Adaptativo**: Interfaz plenamente responsiva (Mobile First) que garantiza un uso eficiente tanto en equipos de escritorio como en dispositivos móviles o tablets dentro de las áreas de trabajo.

---

## Stack Tecnológico

El proyecto se estructura basado en una arquitectura moderna combinada con servicios Backend-as-a-Service, garantizando rendimiento y escalabilidad.

| Tecnología | Propósito Funcional |
| :--- | :--- |
| **React (v19) + Vite** | Motor central del Frontend e inicialización del proyecto. Garantizan renderizado eficiente y desarrollo optimizado. |
| **Tailwind CSS (v4)** | Configuración de la interfaz mediante estilización atómica para mantener un diseño consistente y fluido. |
| **Zustand** | Administración general de estados del cliente. Evita la redundancia de propiedades y sincroniza datos de sesión. |
| **Supabase** | Motor de base de datos relacional (PostgreSQL), gestión de políticas de seguridad y autenticación. |
| **React Router (v7)** | Sistema de enrutamiento seguro para navegación entre paneles de control e inventario. |
| **Framer Motion** | Biblioteca responsable de proveer transiciones de interfaz dinámicas. |

---

## Documentación y Manuales

La documentación académica, técnica y operativa del proyecto ha sido estructurada externamente en formatos PDF (.pdf) y Markdown (.md). 

Toda la información correspondiente al análisis de requerimientos, especificaciones de arquitectura e instrumentación para el usuario puede ser consultada íntegramente en el directorio [`/Documentacion/Manuales/`](./Documentacion/Manuales/).

Nota para la evaluación: En dicha ruta se incluyen los cuatro documentos principales correspondientes a:

1. **Manual de Usuario**: Instrucciones operativas, comprensión del panel principal y registro en el sistema.
2. **Manual Técnico**: Arquitectura requerida, requisitos funcionales/no funcionales y esquema relacional de datos.
3. **Manual de Despliegue**: Instrucciones precisas enfocadas a la infraestructura, compilación final y requerimientos locales.
4. **Manual del Proyecto**: Contexto de su creación, metodología de desarrollo aplicada durante el curso y justificación de viabilidad.

---

## Instalación y Despliegue

Siga las siguientes instrucciones para replicar el entorno de desarrollo local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/JorgeAlegre-403/Proyecto_Trazabilidad.git
```

### 2. Navegar al directorio raíz del aplicativo
```bash
cd Proyecto_Trazabilidad/Aplicativo
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno (.env.local)
Se deberá crear un archivo `.env.local` en el directorio de la aplicación, incorporando las credenciales preasignadas en el servidor Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 5. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

---

<div align="center">
  <p>Software construido para optimizar la eficiencia y seguridad administrativa del sector gastronómico.</p>
</div>
