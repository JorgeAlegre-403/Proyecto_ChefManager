import imagenHero from '../assets/image_hero.avif'
const Hero = () => {
    return (
        <div>
            <section className="bg-gray-100 py-10 justify-between flex items-center shadow-lg mx-auto">
                <aside className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Gestión inteligente de trazabilidad alimentaria</h1>
                    <p className="text-lg mb-8">Tu solución de trazabilidad alimentaria para garantizar la seguridad y calidad de tus productos.</p>
                    <a href="#features" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">Descubre nuestras funcionalidades</a>
                </aside>
                <img src={imagenHero} alt="Imagen de hero" className='rounded-2xl lg:mr-8'/>
            </section>  
        </div>
    )
}

export default Hero