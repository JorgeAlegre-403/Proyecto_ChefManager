import { useState, useEffect } from "react";
import { LuChefHat } from "react-icons/lu";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 group cursor-pointer">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <LuChefHat className="w-6 h-6" />
                        </div>
                        <span className="tracking-tight">TraceFood</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">Inicio</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">Funcionalidades</a>
                        <a href="#contacto" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">Contacto</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:block text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
                            Iniciar Sesión
                        </button>
                        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95">
                            Prueba Gratis
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;