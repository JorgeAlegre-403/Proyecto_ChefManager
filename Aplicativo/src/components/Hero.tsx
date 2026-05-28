import { motion } from "framer-motion";
import imagenHero from '../assets/image_hero.avif'

const Hero = () => {
  return (
    <section className="relative bg-white pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-32 -left-32 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
              Control total de tu restaurante
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Chef<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Manager</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance">
              Diseña tus <strong>menús diarios</strong> con elegancia y profesionalidad, mientras mantienes una <strong>trazabilidad impecable</strong> de tus alimentos. La herramienta definitiva para chefs que valoran la calidad y el control total de su cocina.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 group"
              >
                Conoce cómo funciona
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
              <a
                href="#roles"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-all text-center"
              >
                Ver los roles
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10 border border-gray-100 pr-0">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none z-10"></div>
              <img
                src={imagenHero}
                alt="Gestión integral de restaurante"
                className="w-full h-auto object-cover transform transition-transform duration-700 aspect-[4/3] lg:aspect-auto"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;