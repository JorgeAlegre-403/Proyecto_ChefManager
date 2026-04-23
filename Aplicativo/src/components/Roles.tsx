import { motion } from "framer-motion";
import { LuChefHat, LuClipboardList, LuQrCode } from "react-icons/lu";

const roles = [
    {
        icon: <LuChefHat className="w-12 h-12 text-white" />,
        title: "Jefe de Cocina",
        color: "from-orange-500 to-red-600",
        borderColor: "border-orange-500",
        responsibilities: [
            "Administrar la totalidad del sistema",
            "Crear y asignar usuarios del equipo",
            "Crear el menú diario según ingredientes disponibles",
            "Gestionar alimentos: añadir, editar, eliminar",
            "Controlar fechas de caducidad y calidad",
            "Generar reportes de trazabilidad",
            "Gestionar el QR del menú diario"
        ]
    },
    {
        icon: <LuClipboardList className="w-12 h-12 text-white" />,
        title: "Cocinero",
        color: "from-amber-500 to-orange-500",
        borderColor: "border-amber-500",
        responsibilities: [
            "Registrar nuevos ingredientes al llegar",
            "Actualizar cantidades de alimentos",
            "Consultar ubicación de ingredientes en almacén",
            "Ver el menú diario planificado",
            "Registrar uso de ingredientes",
            "Acceder a la trazabilidad de alimentos",
            "Reportar cambios en stock"
        ]
    },
    {
        icon: <LuQrCode className="w-12 h-12 text-white" />,
        title: "Cliente",
        color: "from-red-500 to-rose-600",
        borderColor: "border-red-500",
        responsibilities: [
            "Escanear QR para ver menú del día",
            "Ver información de alimentos (Alergias)",
            "Visualizar el menú de forma simple y rápida",
            "Sin necesidad de crear cuenta",
            "Acceso desde cualquier dispositivo"
        ]
    }
];

const Roles = () => {
    return (
        <section id="roles" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Los tres pilares de TraceFood
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Cada rol tiene funcionalidades específicas diseñadas para sus necesidades exactas en la gestión del restaurante.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((role, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group flex flex-col h-full"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                        >
                            <div className={`bg-gradient-to-r ${role.color} p-8 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-1">{role.title}</h3>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                                        {role.icon}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Funciones principales</p>
                                <ul className="space-y-3">
                                    {role.responsibilities.map((responsibility, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                            </span>
                                            <span className="text-gray-700 text-sm leading-relaxed">{responsibility}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="px-8 pb-8 pt-4 border-t border-gray-100">
                                <button className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r ${role.color} text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95`}>
                                    Más información
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Roles;
