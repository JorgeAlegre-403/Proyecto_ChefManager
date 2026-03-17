import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import './styles/index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default App
