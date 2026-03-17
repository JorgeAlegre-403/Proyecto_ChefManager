<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/chef-hat.svg" alt="TraceFood Logo" width="80" height="80">
  <h1 align="center">TraceFood</h1>
  <p align="center">
    <strong>Gestión inteligente de trazabilidad alimentaria para cocinas profesionales</strong>
  </p>
  <p align="center">
    <a href="#características">Características</a> •
    <a href="#stack-tecnológico">Stack Tecnológico</a> •
    <a href="#instalación-y-desarrollo">Instalación</a> •
    <a href="#documentación-y-manuales">Documentación</a>
  </p>
</div>

---

## 📖 Sobre el Proyecto

**TraceFood** es una aplicación web de vanguardia diseñada para modernizar y facilitar el trabajo dentro de las cocinas profesionales. Atrás quedó el registro manual en hojas de papel; TraceFood permite a los equipos gastronómicos digitalizar sus almacenes, registrar recepciones de productos, controlar estrictamente las caducidades y automatizar la creación de menús en función de las existencias.

El proyecto se centra en dos pilares fundamentales:
1. **La Seguridad Alimentaria**: Garantizando trazabilidad total desde la recepción del producto hasta que se sirve en la mesa.
2. **Eficiencia y Reducción de Mermas**: Implementando lógicas de planificación inteligente de menús que prioricen los ingredientes más próximos a vencer, minimizando el desperdicio económico y promoviendo la sostenibilidad del negocio.

---

## ✨ Características Principales

- 📦 **Registro Dinámico de Productos**: Ingreso rápido de mercancías (proveedor, lote, fecha de caducidad, zona de almacenaje y fotografía del producto/albarán).
- 🧭 **Mapa de Almacén**: Organización visual de los ingredientes en función de sus condiciones óptimas de conservación.
- 📆 **Planificador de Menús Automático**: Asistente que propone usos de inventario bajo normativa FEFO (First Expired, First Out).
- 🔔 **Sistema de Alertas Visuales**: Notificaciones inmediatas sobre productos cercanos a su límite de consumo.
- 📱 **Diseño "Mobile First" Premium**: Interfaz moderna basada en "glassmorphism", responsiva para su uso intensivo en tablets dentro de las zonas de cocina.

---

## 🛠 Stack Tecnológico

La aplicación ha sido desarrollada utilizando las mejores y más actuales herramientas del ecosistema Frontend de JavaScript.

| Tecnología | Descripción |
| --- | --- |
| **[React v19](https://react.dev/)** | Librería principal para la creación de interfaces de usuario interactivas. |
| **[TypeScript](https://www.typescriptlang.org/)** | Superset de JavaScript que añade tipado estático, vital para la escalabilidad. |
| **[Vite.js](https://vitejs.dev/)** | Empaquetador extremadamente rápido para un entorno de desarrollo óptimo. |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Framework de utilidades CSS para dotar a la app de un diseño premium y responsive rápido. |
| **[Framer Motion](https://www.framer.com/motion/)** | Librería líder para animaciones fluidas al hacer scroll y en transiciones de layout. |

---

## 🚀 Instalación y Desarrollo

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión LTS recomendada, 18.x o superior)
- Git

### Paso a paso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JorgeAlegre-403/Proyecto_Trazabilidad.git
   ```

2. **Navegar a la carpeta del proyecto:**
   ```bash
   cd Proyecto_Trazabilidad
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Arrancar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   > 💡 *El entorno se iniciará habitualmente en [http://localhost:5173/](http://localhost:5173/)*

### Compilar para Producción

Para generar una versión optimizada y minificada para servidores web:
```bash
npm run build
```
Esto creará una carpeta `/dist` en la raíz, que contiene todos los recursos listos para subir a cualquier plataforma (Vercel, Netlify, Nginx, Apache, etc.).

---

## 📚 Documentación y Manuales

El proyecto cuenta con documentación adjunta extremadamente detallada en formato Markdown y PDF, alojada dentro del directorio `/manuales/` en la raíz de este proyecto:

- **📄 Manual de Usuario**: Funcionamiento general, pantallas, dashboard y uso práctico.
- **⚙️ Manual Técnico**: Arquitectura requerida, requisitos (Funcionales y No Funcionales) y modelos de BBDD propuestos.
- **🚀 Manual de Despliegue**: Instrucciones precisas de infraestructura y compilación final.
- **📂 Manual del Proyecto**: Resumen del desarrollo durante los trimestres del curso, metas alcanzadas y enfoque global.

---

<div align="center">
  <p>Construido con ❤️ para hacer las cocinas más simples, eficientes y seguras.</p>
</div>
