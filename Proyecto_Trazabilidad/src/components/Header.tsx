import { LuChefHat } from "react-icons/lu";

const Header = () => {
    return (
        <div>
            <header className="position-sticky top-0 flex items-center justify-between text-xl font-bold bg-blue-200 p-4 rounded-b-lg shadow-md">
                <div className="flex gap-2">
                    <h1><LuChefHat /> TraceFood</h1>
                </div>
                <div className="flex items-center gap-20 cursor-pointer">
                    <span className="hover:underline">Inicio</span>
                    <span className="hover:underline">Funcionalidades</span>
                    <span className="hover:underline">Contacto</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">Iniciar Sesión</button>
                </div>
            </header>
        </div>
    )
}

export default Header