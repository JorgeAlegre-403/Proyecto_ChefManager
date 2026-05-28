import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuChefHat, LuQrCode, LuMenu, LuX, LuBookOpen, LuUsers } from "react-icons/lu";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [drawerOpen]);

    const navLinks = [
        { label: "Inicio", href: "#", icon: <LuChefHat className="w-5 h-5" /> },
        { label: "Funcionalidades", href: "#features", icon: <LuBookOpen className="w-5 h-5" /> },
        { label: "Roles", href: "#roles", icon: <LuUsers className="w-5 h-5" /> }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || drawerOpen
                        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 py-3"
                        : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between">

                        {/* LOGO */}
                        <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 group cursor-pointer">
                            <div className="bg-orange-600 text-white p-1.5 rounded-lg group-hover:bg-orange-700 transition-colors">
                                <LuChefHat className="w-6 h-6" />
                            </div>
                            <span className="tracking-tight">ChefManager</span>
                        </div>

                        {/* NAV DESKTOP */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-gray-600 hover:text-orange-600 font-semibold transition-colors text-sm"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        {/* ACCIONES DESKTOP */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/menu-diario">
                                <button className="flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-2.5 rounded-xl font-bold text-sm border border-orange-100 hover:bg-orange-100 transition-all active:scale-95">
                                    <LuQrCode className="w-4 h-4" />
                                    Menú del Día
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 transition-all active:scale-95">
                                    Acceder
                                </button>
                            </Link>
                        </div>

                        {/* BOTÓN MENÚ MÓVIL (HAMBURGUESA) */}
                        <div className="flex md:hidden items-center gap-2">
                            <Link to="/menu-diario" className="sm:hidden">
                                <button className="flex items-center justify-center p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 active:scale-95">
                                    <LuQrCode className="w-5 h-5" />
                                </button>
                            </Link>
                            <button
                                onClick={() => setDrawerOpen(!drawerOpen)}
                                className="flex items-center justify-center p-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white active:scale-95"
                                aria-label="Toggle menu"
                            >
                                {drawerOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* OVERLAY BACKDROP */}
            <div
                onClick={() => setDrawerOpen(false)}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* DRAWER LATERAL MÓVIL */}
            <div
                className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header del Drawer */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-orange-50/40">
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <div className="bg-orange-600 text-white p-1 rounded-lg">
                            <LuChefHat className="w-5 h-5" />
                        </div>
                        <span className="tracking-tight">ChefManager</span>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:text-gray-800"
                    >
                        <LuX className="w-5 h-5" />
                    </button>
                </div>

                {/* Enlaces de navegación */}
                <div className="flex-grow p-5 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1 px-3">
                        Navegación
                    </span>
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition-all"
                        >
                            <span className="text-gray-400 group-hover:text-orange-600">{link.icon}</span>
                            {link.label}
                        </a>
                    ))}
                    
                    <div className="h-px bg-gray-100 my-3" />
                    
                    <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1 px-3">
                        Páginas Públicas
                    </span>
                    <Link
                        to="/menu-diario"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition-all"
                    >
                        <LuQrCode className="w-5 h-5 text-gray-400" />
                        Ver Menú del Día
                    </Link>
                </div>

                {/* Botón de acceso al fondo */}
                <div className="p-5 border-t border-gray-100">
                    <Link to="/login" onClick={() => setDrawerOpen(false)}>
                        <button className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700 shadow-lg shadow-orange-600/10 active:scale-95 transition-all">
                            Acceder al Sistema
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Header;