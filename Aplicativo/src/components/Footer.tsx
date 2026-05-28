import { LuChefHat } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

          <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-left">
            <div className="flex items-center gap-2 text-2xl font-bold text-orange-400 mb-4">
              <LuChefHat className="text-3xl" /> ChefManager
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevando la creación de menús diarios con un control de trazabilidad de última generación. La excelencia empieza en la gestión.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-4 text-gray-200">Producto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#features" className="hover:text-orange-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#roles" className="hover:text-orange-400 transition-colors">Roles</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Documentación</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-4 text-gray-200">Compañía</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ChefManager. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
