import { motion } from "framer-motion";
import { LuClipboardList, LuCalendarDays, LuBoxes, LuShieldCheck } from "react-icons/lu";

const features = [
  {
    icon: <LuClipboardList className="w-8 h-8 text-blue-500" />,
    title: "Registro de Productos",
    description: "Almacena información vital: nombre, fechas de entrega y caducidad, zona de almacén e imagen del producto."
  },
  {
    icon: <LuCalendarDays className="w-8 h-8 text-emerald-500" />,
    title: "Planificación de Menús",
    description: "Diseña menús semanales de forma inteligente, basados en la disponibilidad y caducidad de tus ingredientes."
  },
  {
    icon: <LuBoxes className="w-8 h-8 text-indigo-500" />,
    title: "Organización del Almacén",
    description: "Mantén un control preciso y digital de la ubicación de cada producto para una cocina más eficiente."
  },
  {
    icon: <LuShieldCheck className="w-8 h-8 text-rose-500" />,
    title: "Seguridad Alimentaria",
    description: "Garantiza la trazabilidad completa desde la recepción hasta el plato, cumpliendo con las normativas."
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
            Todo lo que necesitas para tu cocina
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Digitaliza y optimiza la gestión de tu almacén con herramientas diseñadas específicamente para profesionales gastronómicos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
