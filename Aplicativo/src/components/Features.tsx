import { motion } from "framer-motion";
import { LuClipboardList, LuCalendarDays, LuBoxes, LuQrCode, LuUsers, LuChefHat } from "react-icons/lu";

const features = [
  {
    icon: <LuClipboardList className="w-8 h-8 text-orange-500" />,
    title: "Registro de Alimentos",
    description: "Documenta cada ingrediente: nombre, fecha de entrada, caducidad, ubicación y cantidad disponible en tu almacén.",
    role: "Todos los roles"
  },
  {
    icon: <LuCalendarDays className="w-8 h-8 text-amber-500" />,
    title: "Menú Diario Inteligente",
    description: "Crea menús basados en los alimentos disponibles y sus fechas de caducidad. Optimiza recursos y reduce desperdicios.",
    role: "Jefe de Cocina"
  },
  {
    icon: <LuQrCode className="w-8 h-8 text-red-500" />,
    title: "Acceso mediante QR",
    description: "Los clientes escanean un QR para ver el menú del día de forma rápida y segura desde cualquier dispositivo.",
    role: "Clientes"
  },
  {
    icon: <LuBoxes className="w-8 h-8 text-orange-600" />,
    title: "Control de Almacén",
    description: "Visualiza la ubicación exacta de cada ingrediente y mantén un inventario actualizado en tiempo real.",
    role: "Todos los roles"
  },
  {
    icon: <LuUsers className="w-8 h-8 text-amber-600" />,
    title: "Gestión de Permisos",
    description: "Asigna roles diferenciados: Jefe de Cocina administra todo, cocineros añaden ingredientes, clientes solo visualizan menús.",
    role: "Jefe de Cocina"
  },
  {
    icon: <LuChefHat className="w-8 h-8 text-red-600" />,
    title: "Trazabilidad Total",
    description: "Rastrear cada ingrediente desde su recepción hasta su uso en el plato. Garantiza calidad y seguridad alimentaria.",
    role: "Todos los roles"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Funcionalidades para gestionar tu restaurante
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Una plataforma integral diseñada para que cada miembro de tu equipo tenga las herramientas exactas que necesita.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                {feature.role}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
